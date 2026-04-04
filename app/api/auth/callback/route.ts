import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { generateReferralCode } from "@/lib/referral";

// Supabase Auth callback — handles email confirmation & OAuth redirects
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const ref = url.searchParams.get("ref");          // referral code from signup
  const next = url.searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", req.url));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
  }

  const user = data.user;

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    // New user — create profile
    const referralCode = generateReferralCode(user.id);

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name ?? null,
      plan: "chai",
      pins_used_this_month: 0,
      referral_code: referralCode,
      referred_by: ref ?? null,
      referral_count: 0,
      free_months_earned: 0,
    });

    if (profileError) console.error("Profile creation error:", profileError);

    // Process referral if exists
    if (ref) {
      // Find referrer
      const { data: referrer } = await supabase
        .from("profiles")
        .select("id, referral_count, free_months_earned")
        .eq("referral_code", ref)
        .single();

      if (referrer && referrer.referral_count < 6) {
        // Log the referral
        await supabase.from("referral_rewards").insert({
          referrer_id: referrer.id,
          referred_id: user.id,
          referred_email: user.email,
          status: "activated",
          reward_months: 1,
        });

        // Give referrer 1 free month
        await supabase
          .from("profiles")
          .update({
            referral_count: referrer.referral_count + 1,
            free_months_earned: referrer.free_months_earned + 1,
          })
          .eq("id", referrer.id);

        // Give new user 1 free month too
        await supabase
          .from("profiles")
          .update({ free_months_earned: 1 })
          .eq("id", user.id);
      }
    }

    return NextResponse.redirect(new URL("/dashboard?welcome=true", req.url));
  }

  return NextResponse.redirect(new URL(next, req.url));
}
