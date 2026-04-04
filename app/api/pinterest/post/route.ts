import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createPin, refreshAccessToken } from "@/lib/pinterest";

const PLAN_LIMITS: Record<string, number> = {
  chai: 10,
  biryani: 999,
  thali: 999,
};

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { pinId } = await req.json();
  if (!pinId) return NextResponse.json({ error: "pinId required" }, { status: 400 });

  // Fetch user profile + pin
  const [{ data: profile }, { data: pin }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("pins").select("*").eq("id", pinId).eq("user_id", user.id).single(),
  ]);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  if (!pin) return NextResponse.json({ error: "Pin not found" }, { status: 404 });
  if (!profile.pinterest_access_token) {
    return NextResponse.json({ error: "Pinterest not connected" }, { status: 400 });
  }

  // Check plan limits
  const limit = PLAN_LIMITS[profile.plan] ?? 10;
  if (profile.pins_used_this_month >= limit) {
    return NextResponse.json({
      error: `Monthly pin limit reached (${limit}). Upgrade to post more.`,
      upgrade: true,
    }, { status: 429 });
  }

  if (!pin.image_url) {
    return NextResponse.json({ error: "Pin has no image URL" }, { status: 400 });
  }

  // Post to Pinterest (with token refresh on 401)
  async function attemptPost(token: string) {
    return createPin(token, {
      boardId: pin.board_id,
      title: pin.title,
      description: pin.description,
      imageUrl: pin.image_url!,
      linkUrl: pin.link_url ?? undefined,
    });
  }

  try {
    let postedPin;
    try {
      postedPin = await attemptPost(profile.pinterest_access_token);
    } catch (err: unknown) {
      // Refresh token and retry once
      if (!profile.pinterest_refresh_token) throw err;
      const newTokens = await refreshAccessToken(profile.pinterest_refresh_token);
      await supabase.from("profiles").update({
        pinterest_access_token: newTokens.access_token,
        pinterest_refresh_token: newTokens.refresh_token,
      }).eq("id", user.id);
      postedPin = await attemptPost(newTokens.access_token);
    }

    // Update pin record + increment usage counter
    await Promise.all([
      supabase.from("pins").update({
        status: "posted",
        posted_at: new Date().toISOString(),
        pinterest_pin_id: postedPin.id,
      }).eq("id", pinId),

      supabase.from("profiles").update({
        pins_used_this_month: profile.pins_used_this_month + 1,
      }).eq("id", user.id),
    ]);

    return NextResponse.json({
      success: true,
      pinterestPinId: postedPin.id,
      pinterestLink: `https://pinterest.com/pin/${postedPin.id}`,
    });
  } catch (err) {
    // Mark pin as failed
    await supabase.from("pins").update({ status: "failed" }).eq("id", pinId);
    console.error("Pin post error:", err);
    return NextResponse.json({ error: "Failed to post pin to Pinterest" }, { status: 500 });
  }
}
