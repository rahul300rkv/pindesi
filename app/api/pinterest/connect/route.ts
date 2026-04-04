import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getPinterestAuthUrl } from "@/lib/pinterest";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const state = Buffer.from(user.id).toString("base64url");
  return NextResponse.redirect(getPinterestAuthUrl(state));
}
