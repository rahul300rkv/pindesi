"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NICHES = [
  "Indian Home Decor 🏠", "Desi Recipes 🍛", "Bollywood Fashion 👗",
  "Budget Travel India ✈️", "Mehendi & Bridal 💍", "Festival & DIY 🪔",
  "Indian Skincare ✨", "Yoga & Wellness 🧘", "Finance & Hustles 💰",
];

function SignupContent() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const [form, setForm] = useState({ name: "", email: "", password: "", niche: "", ref });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password || !form.niche) {
      setError("Please fill all required fields");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true); setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, niche: form.niche } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    if (user) {
      const { generateReferralCode } = await import("@/lib/referral");
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        name: form.name || null,
        plan: "chai",
        pins_used_this_month: 0,
        referral_code: generateReferralCode(user.id),
        referred_by: ref || null,
        referral_count: 0,
        free_months_earned: 0,
      });

      if (ref) {
        const { data: referrer } = await supabase
          .from("profiles")
          .select("id, referral_count, free_months_earned")
          .eq("referral_code", ref)
          .single();

        if (referrer && referrer.referral_count < 6) {
          await supabase.from("referral_rewards").insert({
            referrer_id: referrer.id,
            referred_id: user.id,
            referred_email: user.email,
            status: "activated",
            reward_months: 1,
          });
          await supabase.from("profiles").update({
            referral_count: referrer.referral_count + 1,
            free_months_earned: referrer.free_months_earned + 1,
          }).eq("id", referrer.id);
          await supabase.from("profiles").update({
            free_months_earned: 1,
          }).eq("id", user.id);
        }
      }
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session) {
      window.location.href = "/dashboard?welcome=true";
    } else {
      setDone(true);
    }
    setLoading(false);
  }

  const s = {
    bg: "#1A0A00", text: "#FFFAF6",
    muted: "rgba(255,250,246,0.5)",
    border: "rgba(255,250,246,0.1)",
    accent: "#FF6B00",
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "var(--font-dm, DM Sans, sans-serif)" }}>
        <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
          <a href="/" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 28, fontWeight: 800, color: s.text, textDecoration: "none" }}>
            Pin<span style={{ color: s.accent }}>Desi</span>
          </a>
          <div style={{ background: "rgba(255,250,246,0.04)", border: `1px solid ${s.border}`, borderRadius: 16, padding: 32, marginTop: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: s.text, marginBottom: 10 }}>
              Confirm your email
            </h2>
            <p style={{ fontSize: 14, color: s.muted, lineHeight: 1.65, marginBottom: 20 }}>
              We sent a confirmation link to{" "}
              <strong style={{ color: s.text }}>{form.email}</strong>.
              Click it to activate your account, then sign in.
            </p>
            <a href="/login" style={{ display: "inline-block", padding: "12px 28px", background: s.accent, color: "white", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              Go to sign in →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "var(--font-dm, DM Sans, sans-serif)" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 28, fontWeight: 800, color: s.text, textDecoration: "none" }}>
            Pin<span style={{ color: s.accent }}>Desi</span>
          </a>
          <p style={{ fontSize: 14, color: s.muted, marginTop: 8 }}>Start growing your Pinterest today</p>
        </div>

        <div style={{ background: "rgba(255,250,246,0.04)", border: `1px solid ${s.border}`, borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: s.text, marginBottom: 4 }}>
            Create your account
          </h2>
          {ref && (
            <div style={{ fontSize: 13, color: s.accent, marginBottom: 12, background: "rgba(255,107,0,0.1)", padding: "8px 12px", borderRadius: 6 }}>
              🎁 Referral bonus: 1 free month on signup!
            </div>
          )}
          <p style={{ fontSize: 14, color: s.muted, marginBottom: 24, lineHeight: 1.6 }}>
            Free forever. No credit card needed.
          </p>

          {error && (
            <div style={{ fontSize: 13, color: "#ff6b6b", marginBottom: 16, padding: "10px 12px", background: "rgba(230,0,35,0.08)", borderRadius: 8 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Your name</label>
              <input type="text" placeholder="Priya Sharma" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Email address *</label>
              <input type="email" placeholder="you@gmail.com" required value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Password *</label>
              <input type="password" placeholder="Min. 6 characters" required value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Your main niche *</label>
              <select required value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: form.niche ? s.text : s.muted, fontSize: 14, fontFamily: "inherit", outline: "none" }}>
                <option value="">Select your niche...</option>
                {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            {ref && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Referral code</label>
                <input value={form.ref} readOnly style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,107,0,0.3)", background: "rgba(255,107,0,0.06)", color: s.accent, fontSize: 14, fontFamily: "inherit", fontWeight: 600 }} />
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px 20px", background: loading ? "#994000" : s.accent, color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              {loading ? "Creating account..." : "Create free account →"}
            </button>
            <p style={{ fontSize: 11, color: s.muted, textAlign: "center", marginTop: 12 }}>No spam. No credit card. Made in India 🧡</p>
          </form>
          <p style={{ fontSize: 13, color: s.muted, textAlign: "center", marginTop: 20 }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: s.accent, textDecoration: "none", fontWeight: 600 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Signup() {
  return <Suspense fallback={null}><SignupContent /></Suspense>;
}
