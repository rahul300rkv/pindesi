"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  const s = {
    bg: "#1A0A00", text: "#FFFAF6",
    muted: "rgba(255,250,246,0.5)",
    border: "rgba(255,250,246,0.1)",
    accent: "#FF6B00",
  };

  return (
    <div style={{ minHeight: "100vh", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "var(--font-dm, DM Sans, sans-serif)" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 28, fontWeight: 800, color: s.text, textDecoration: "none" }}>
            Pin<span style={{ color: s.accent }}>Desi</span>
          </a>
        </div>
        <div style={{ background: "rgba(255,250,246,0.04)", border: `1px solid ${s.border}`, borderRadius: 16, padding: 28 }}>
          {!sent ? (
            <>
              <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: s.text, marginBottom: 6 }}>Reset password</h2>
              <p style={{ fontSize: 14, color: s.muted, marginBottom: 24, lineHeight: 1.6 }}>Enter your email and we&apos;ll send you a reset link.</p>
              {error && <div style={{ fontSize: 13, color: "#ff6b6b", marginBottom: 16, padding: "10px 12px", background: "rgba(230,0,35,0.08)", borderRadius: 8 }}>{error}</div>}
              <form onSubmit={handleReset}>
                <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Email address</label>
                <input type="email" required placeholder="you@gmail.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 16 }} />
                <button type="submit" disabled={loading}
                  style={{ width: "100%", padding: "13px 20px", background: loading ? "#994000" : s.accent, color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                  {loading ? "Sending..." : "Send reset link →"}
                </button>
              </form>
              <p style={{ fontSize: 13, color: s.muted, textAlign: "center", marginTop: 20 }}>
                <a href="/login" style={{ color: s.accent, textDecoration: "none", fontWeight: 600 }}>← Back to sign in</a>
              </p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
              <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: s.text, marginBottom: 10 }}>Check your inbox</h2>
              <p style={{ fontSize: 14, color: s.muted, lineHeight: 1.65, marginBottom: 20 }}>Reset link sent to <strong style={{ color: s.text }}>{email}</strong>.</p>
              <a href="/login" style={{ display: "inline-block", padding: "12px 28px", background: s.accent, color: "white", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>Back to sign in</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
