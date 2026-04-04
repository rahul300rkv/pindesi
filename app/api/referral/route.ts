import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getReferralLink } from "@/lib/referral";

// GET — fetch current user's referral stats
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const [{ data: profile }, { data: rewards }] = await Promise.all([
    supabase.from("profiles")
      .select("referral_code, referral_count, free_months_earned, plan")
      .eq("id", user.id).single(),
    supabase.from("referral_rewards")
      .select("referred_email, status, reward_months, created_at")
      .eq("referrer_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const baseUrl = req.headers.get("origin") ?? "https://pindesi.vercel.app";
  const link = getReferralLink(profile.referral_code, baseUrl);

  return NextResponse.json({
    referralCode: profile.referral_code,
    referralLink: link,
    referralCount: profile.referral_count,
    freeMonthsEarned: profile.free_months_earned,
    maxReferrals: 6,
    rewards: rewards ?? [],
  });
}
