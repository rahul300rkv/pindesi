import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserPlan = "chai" | "biryani" | "thali";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  plan: UserPlan;
  pins_used_this_month: number;
  pinterest_access_token: string | null;
  pinterest_refresh_token: string | null;
  pinterest_username: string | null;
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  free_months_earned: number;
  plan_expires_at: string | null;
  created_at: string;
}

export interface Pin {
  id: string;
  user_id: string;
  title: string;
  description: string;
  hashtags: string[];
  board_id: string;
  board_name: string;
  image_url: string | null;
  link_url: string | null;
  status: "draft" | "scheduled" | "posted" | "failed";
  scheduled_at: string | null;
  posted_at: string | null;
  pinterest_pin_id: string | null;
  niche: string;
  created_at: string;
}

export interface ReferralReward {
  id: string;
  referrer_id: string;
  referred_id: string;
  referred_email: string;
  status: "pending" | "activated" | "rewarded";
  reward_months: number;
  created_at: string;
}
