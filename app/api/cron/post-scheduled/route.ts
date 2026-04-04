import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-server";
import { createPin, refreshAccessToken } from "@/lib/pinterest";

const PLAN_LIMITS: Record<string, number> = { chai: 10, biryani: 999, thali: 999 };

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const now = new Date();
  const windowEnd = new Date(now.getTime() + 16 * 60 * 1000);

  const { data: duePins, error } = await supabase
    .from("pins")
    .select("*, profiles!inner(id, plan, pins_used_this_month, pinterest_access_token, pinterest_refresh_token)")
    .eq("status", "scheduled")
    .lte("scheduled_at", windowEnd.toISOString())
    .gte("scheduled_at", now.toISOString())
    .limit(50);

  if (error) return NextResponse.json({ error: "DB fetch failed" }, { status: 500 });
  if (!duePins || duePins.length === 0) return NextResponse.json({ posted: 0, message: "No pins due" });

  const results = { posted: 0, failed: 0, skipped: 0 };

  for (const pin of duePins) {
    const profile = (pin as Record<string, unknown>).profiles as Record<string, unknown>;
    if (!profile.pinterest_access_token || !pin.image_url) {
      await supabase.from("pins").update({ status: "failed" }).eq("id", pin.id);
      results.failed++; continue;
    }

    const limit = PLAN_LIMITS[profile.plan as string] ?? 10;
    if ((profile.pins_used_this_month as number) >= limit) { results.skipped++; continue; }

    try {
      let postedPin;
      try {
        postedPin = await createPin(profile.pinterest_access_token as string, {
          boardId: pin.board_id, title: pin.title, description: pin.description,
          imageUrl: pin.image_url, linkUrl: pin.link_url ?? undefined,
        });
      } catch {
        const newTokens = await refreshAccessToken(profile.pinterest_refresh_token as string);
        await supabase.from("profiles").update({
          pinterest_access_token: newTokens.access_token,
          pinterest_refresh_token: newTokens.refresh_token,
        }).eq("id", profile.id);
        postedPin = await createPin(newTokens.access_token, {
          boardId: pin.board_id, title: pin.title, description: pin.description,
          imageUrl: pin.image_url, linkUrl: pin.link_url ?? undefined,
        });
      }

      await Promise.all([
        supabase.from("pins").update({ status: "posted", posted_at: new Date().toISOString(), pinterest_pin_id: postedPin.id }).eq("id", pin.id),
        supabase.from("profiles").update({ pins_used_this_month: (profile.pins_used_this_month as number) + 1 }).eq("id", profile.id),
      ]);
      results.posted++;
    } catch (err) {
      console.error("Pin post failed:", pin.id, err);
      await supabase.from("pins").update({ status: "failed" }).eq("id", pin.id);
      results.failed++;
    }
    await new Promise(r => setTimeout(r, 500));
  }

  return NextResponse.json(results);
}
