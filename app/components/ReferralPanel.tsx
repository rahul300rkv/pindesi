"use client";
import { useEffect, useState } from "react";

interface ReferralData {
  referralCode: string;
  referralLink: string;
  referralCount: number;
  freeMonthsEarned: number;
  maxReferrals: number;
  rewards: { referred_email: string; status: string; created_at: string }[];
}

export default function ReferralPanel() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referral")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function copyLink() {
    if (!data) return;
    navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const s = { text: "#FFFAF6", muted: "rgba(255,250,246,0.5)", border: "rgba(255,250,246,0.1)", accent: "#FF6B00", card: "rgba(255,250,246,0.05)" };

  if (loading) return <div style={{ padding: 20, color: s.muted, fontSize: 14 }}>Loading referral data...</div>;

  if (!data || data.referralCode === undefined) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p style={{ color: s.muted, fontSize: 14 }}>Sign in to access your referral program.</p>
        <a href="/login" style={{ color: s.accent, fontSize: 14, fontWeight: 600 }}>Sign in →</a>
      </div>
    );
  }

  const progressPct = Math.min((data.referralCount / data.maxReferrals) * 100, 100);

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", color: s.text, marginBottom: 6 }}>Refer & Earn 🎁</h1>
      <p style={{ fontSize: 14, color: s.muted, marginBottom: 28 }}>Invite friends. Earn 1 free month per successful referral. Max 6 months free.</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          ["Friends referred", data.referralCount, `of ${data.maxReferrals} max`],
          ["Free months earned", data.freeMonthsEarned, "months added to your plan"],
          ["Months remaining", data.maxReferrals - data.referralCount, "more referrals available"],
        ].map(([l, v, sub]) => (
          <div key={String(l)} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{l}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: s.text, fontFamily: "var(--font-syne, Syne, sans-serif)", marginBottom: 2 }}>{v}</div>
            <div style={{ fontSize: 12, color: s.accent }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: s.text }}>Referral progress</div>
          <div style={{ fontSize: 13, color: s.accent, fontWeight: 600 }}>{data.referralCount} / {data.maxReferrals}</div>
        </div>
        <div style={{ height: 8, background: "rgba(255,250,246,0.1)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg, ${s.accent}, #FFAA00)`, borderRadius: 4, transition: "width 0.6s ease" }} />
        </div>
        <div style={{ fontSize: 12, color: s.muted, marginTop: 8 }}>
          {data.referralCount >= data.maxReferrals
            ? "🎉 Maximum referrals reached! You've earned 6 free months."
            : `${data.maxReferrals - data.referralCount} more referrals to unlock maximum free months`}
        </div>
      </div>

      {/* Referral link */}
      <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "20px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: s.text, marginBottom: 14 }}>Your referral link</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, padding: "11px 14px", background: "#2D1200", border: `1px solid ${s.border}`, borderRadius: 8, fontSize: 13, color: s.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {data.referralLink}
          </div>
          <button onClick={copyLink} style={{ padding: "11px 18px", background: copied ? "#22c55e" : s.accent, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", flexShrink: 0 }}>
            {copied ? "Copied! ✓" : "Copy link"}
          </button>
        </div>

        {/* Share buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Share on WhatsApp", color: "#25D366", href: `https://wa.me/?text=${encodeURIComponent(`Join me on PinDesi — the Pinterest automation tool built for Indian creators! Use my link to get 1 free month: ${data.referralLink}`)}` },
            { label: "Share on Instagram", color: "#E1306C", href: "#" },
            { label: "Share via Email", color: "#4A90D9", href: `mailto:?subject=Join PinDesi — Pinterest automation for Indian creators&body=Hey! I've been using PinDesi to grow my Pinterest and it's amazing. Use my referral link to get 1 free month: ${data.referralLink}` },
          ].map(btn => (
            <a key={btn.label} href={btn.href} target="_blank" rel="noreferrer" style={{ padding: "8px 14px", background: btn.color, color: "white", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
              {btn.label}
            </a>
          ))}
        </div>
      </div>

      {/* Referral history */}
      {data.rewards.length > 0 && (
        <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "20px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: s.text, marginBottom: 14 }}>Referral history</div>
          {data.rewards.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < data.rewards.length - 1 ? `1px solid ${s.border}` : "none" }}>
              <div>
                <div style={{ fontSize: 13, color: s.text }}>{r.referred_email}</div>
                <div style={{ fontSize: 11, color: s.muted }}>{new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: r.status === "rewarded" ? "rgba(34,197,94,0.15)" : "rgba(255,107,0,0.15)", color: r.status === "rewarded" ? "#22c55e" : s.accent }}>
                {r.status === "rewarded" ? "+1 month ✓" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* How it works */}
      <div style={{ marginTop: 20, background: "rgba(255,107,0,0.06)", border: "1px solid rgba(255,107,0,0.15)", borderRadius: 12, padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: s.accent, marginBottom: 12 }}>How referrals work</div>
        {[
          ["Share your link", "Send your unique link to friends, post it on Instagram, or share in WhatsApp groups of Indian creators."],
          ["They sign up", "When someone creates a PinDesi account using your link, you both get 1 free month automatically."],
          ["Earn up to 6 months", "Refer up to 6 friends and earn up to 6 free months of the Biryani plan (worth ₹2,994)."],
        ].map(([title, desc], i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
            <div style={{ width: 22, height: 22, background: s.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: s.text, marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: 12, color: s.muted, lineHeight: 1.55 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
