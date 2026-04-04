"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function LoginContent() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const errorParam = params.get("error");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  const s = { bg: "#1A0A00", text: "#FFFAF6", muted: "rgba(255,250,246,0.5)", border: "rgba(255,250,246,0.1)", accent: "#FF6B00" };

  return (
    <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "var(--font-dm, DM Sans, sans-serif)" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 28, fontWeight: 800, color: s.text, textDecoration: "none" }}>
            Pin<span style={{ color: s.accent }}>Desi</span>
          </a>
          <p style={{ fontSize: 14, color: s.muted, marginTop: 8 }}>Sign in to your account</p>
        </div>

        {errorParam && (
          <div style={{ background: "rgba(230,0,35,0.1)", border: "1px solid rgba(230,0,35,0.2)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#ff6b6b", marginBottom: 20, textAlign: "center" }}>
            {errorParam === "auth_failed" ? "Sign in failed. Please try again." : "Something went wrong. Please try again."}
          </div>
        )}

        <div style={{ background: "rgba(255,250,246,0.04)", border: `1px solid ${s.border}`, borderRadius: 16, padding: 28 }}>
          {!sent ? (
            <>
              <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: s.text, marginBottom: 6 }}>Welcome back 🧡</h2>
              <p style={{ fontSize: 14, color: s.muted, marginBottom: 24, lineHeight: 1.6 }}>Enter your email and we'll send you a magic link — no password needed.</p>
              <form onSubmit={handleLogin}>
                <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Email address</label>
                <input
                  type="email" required placeholder="you@gmail.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 14, fontFamily: "inherit", marginBottom: 16, outline: "none" }}
                />
                {error && <div style={{ fontSize: 13, color: "#ff6b6b", marginBottom: 14 }}>{error}</div>}
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px 20px", background: loading ? "#994000" : s.accent, color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                  {loading ? "Sending..." : "Send magic link →"}
                </button>
              </form>
              <p style={{ fontSize: 13, color: s.muted, textAlign: "center", marginTop: 20 }}>
                No account? <a href="/signup" style={{ color: s.accent, textDecoration: "none", fontWeight: 600 }}>Sign up free</a>
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: s.text, marginBottom: 10 }}>Check your inbox!</h2>
              <p style={{ fontSize: 14, color: s.muted, lineHeight: 1.65 }}>
                We sent a magic link to <strong style={{ color: s.text }}>{email}</strong>. Click it to sign in — it expires in 10 minutes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return <Suspense fallback={null}><LoginContent /></Suspense>;
}
