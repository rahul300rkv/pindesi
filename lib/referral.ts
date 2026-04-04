// Referral utilities — generate codes, validate, apply rewards

export function generateReferralCode(userId: string): string {
  // Short memorable code: first 4 chars of userId + 4 random chars
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  const prefix = userId.replace(/-/g, "").slice(0, 4).toUpperCase();
  return `${prefix}${random}`;
}

export function getReferralLink(code: string, baseUrl: string): string {
  return `${baseUrl}/signup?ref=${code}`;
}

export const REFERRAL_REWARDS = {
  referrer: 1,    // 1 free month per successful referral
  referred: 1,    // 1 free month for the person who signs up via referral
  max_per_referrer: 6,  // max 6 free months (6 referrals) per user
} as const;

export function calculatePlanEndDate(
  currentEnd: Date | null,
  freeMonthsToAdd: number
): Date {
  const base = currentEnd && currentEnd > new Date() ? currentEnd : new Date();
  const result = new Date(base);
  result.setMonth(result.getMonth() + freeMonthsToAdd);
  return result;
}
