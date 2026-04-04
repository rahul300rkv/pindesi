import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { exchangeCodeForToken, getPinterestUser } from "@/lib/pinterest";

// Step 2: Pinterest redirects back here with auth code
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(new URL("/dashboard/settings?pinterest=denied", req.url));
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  // Verify state matches user id (CSRF protection)
  const expectedState = Buffer.from(user.id).toString("base64url");
  if (state !== expectedState) {
    return NextResponse.redirect(new URL("/dashboard?error=invalid_state", req.url));
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(code);

    // Fetch Pinterest profile
    const pinterestUser = await getPinterestUser(tokens.access_token);

    // Save tokens and Pinterest username to profile
    await supabase.from("profiles").update({
      pinterest_access_token: tokens.access_token,
      pinterest_refresh_token: tokens.refresh_token,
      pinterest_username: pinterestUser.username,
    }).eq("id", user.id);

    return NextResponse.redirect(
      new URL("/dashboard?pinterest=connected&username=" + pinterestUser.username, req.url)
    );
  } catch (err) {
    console.error("Pinterest callback error:", err);
    return NextResponse.redirect(new URL("/dashboard?pinterest=error", req.url));
  }
}
