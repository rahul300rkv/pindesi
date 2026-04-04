import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getPinterestBoards, refreshAccessToken } from "@/lib/pinterest";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("pinterest_access_token, pinterest_refresh_token")
    .eq("id", user.id)
    .single();

  if (!profile?.pinterest_access_token) {
    return NextResponse.json({ error: "Pinterest not connected" }, { status: 400 });
  }

  try {
    const boards = await getPinterestBoards(profile.pinterest_access_token);
    return NextResponse.json({ boards });
  } catch {
    // Token may be expired — try refresh
    if (!profile.pinterest_refresh_token) {
      return NextResponse.json({ error: "Pinterest token expired" }, { status: 401 });
    }
    try {
      const newTokens = await refreshAccessToken(profile.pinterest_refresh_token);
      await supabase.from("profiles").update({
        pinterest_access_token: newTokens.access_token,
        pinterest_refresh_token: newTokens.refresh_token,
      }).eq("id", user.id);

      const boards = await getPinterestBoards(newTokens.access_token);
      return NextResponse.json({ boards });
    } catch {
      return NextResponse.json({ error: "Pinterest auth expired, please reconnect" }, { status: 401 });
    }
  }
}
