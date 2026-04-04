"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const NICHES = ["Indian Home Decor 🏠","Desi Recipes 🍛","Bollywood Fashion 👗","Budget Travel India ✈️","Mehendi & Bridal 💍","Festival & DIY 🪔","Indian Skincare ✨","Yoga & Wellness 🧘","Finance & Hustles 💰"];

function SignupContent() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const [form, setForm] = useState({ name: "", email: "", niche: "", ref });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.niche) { setError("Please fill all required fields"); return; }
    setLoading(true); setError("");

    const redirectUrl = new URL(`${window.location.origin}/api/auth/callback`);
    if (form.ref) redirectUrl.searchParams.set("ref", form.ref);

    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        emailRedirectTo: redirectUrl.toString(),
        data: { name: form.name, niche: form.niche },
      },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  const s = { bg: "#1A0A00", text: "#FFFAF6", muted: "rgba(255,250,246,0.5)", border: "rgba(255,250,246,0.1)", accent: "#FF6B00" };

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
          {!sent ? (
            <>
              <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: s.text, marginBottom: 4 }}>Create your account</h2>
              {ref && <div style={{ fontSize: 13, color: s.accent, marginBottom: 16, background: "rgba(255,107,0,0.1)", padding: "8px 12px", borderRadius: 6 }}>🎁 Referral bonus: 1 free month on signup!</div>}
              <p style={{ fontSize: 14, color: s.muted, marginBottom: 24, lineHeight: 1.6 }}>Free forever. No credit card. We'll email you a magic link to get started.</p>
              <form onSubmit={handleSignup}>
                {[
                  { label: "Your name", key: "name", type: "text", placeholder: "Priya Sharma", required: false },
                  { label: "Email address *", key: "email", type: "email", placeholder: "you@gmail.com", required: true },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>{f.label}</label>
                    <input
                      type={f.type} placeholder={f.placeholder} required={f.required}
                      value={(form as Record<string,string>)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 14, fontFamily: "inherit", outline: "none" }}
                    />
                  </div>
                ))}

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Your main niche *</label>
                  <select required value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))} style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: form.niche ? s.text : s.muted, fontSize: 14, fontFamily: "inherit", outline: "none" }}>
                    <option value="">Select your niche...</option>
                    {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {ref && (
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Referral code</label>
                    <input value={form.ref} readOnly style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid rgba(255,107,0,0.3)`, background: "rgba(255,107,0,0.06)", color: s.accent, fontSize: 14, fontFamily: "inherit", fontWeight: 600 }} />
                  </div>
                )}

                {error && <div style={{ fontSize: 13, color: "#ff6b6b", marginBottom: 14, padding: "8px 12px", background: "rgba(230,0,35,0.08)", borderRadius: 6 }}>{error}</div>}

                <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px 20px", background: loading ? "#994000" : s.accent, color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                  {loading ? "Creating account..." : "Create free account →"}
                </button>
                <p style={{ fontSize: 11, color: s.muted, textAlign: "center", marginTop: 12 }}>No spam. No credit card. Made in India 🧡</p>
              </form>
              <p style={{ fontSize: 13, color: s.muted, textAlign: "center", marginTop: 20 }}>
                Already have an account? <a href="/login" style={{ color: s.accent, textDecoration: "none", fontWeight: 600 }}>Sign in</a>
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: s.text, marginBottom: 10 }}>Check your email!</h2>
              <p style={{ fontSize: 14, color: s.muted, lineHeight: 1.65 }}>
                We sent a magic link to <strong style={{ color: s.text }}>{form.email}</strong>. Click it to activate your account.
              </p>
              {ref && <p style={{ fontSize: 14, color: s.accent, marginTop: 12, fontWeight: 600 }}>🎁 Your free month will be applied automatically.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Signup() {
  return <Suspense fallback={null}><SignupContent /></Suspense>;
}
