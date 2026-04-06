"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function LoginContent() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const errorParam = params.get("error");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("Invalid login")) {
        setError("Incorrect email or password. Please try again.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please confirm your email first — check your inbox for the confirmation link.");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
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
          <p style={{ fontSize: 14, color: s.muted, marginTop: 8 }}>Sign in to your account</p>
        </div>

        <div style={{ background: "rgba(255,250,246,0.04)", border: `1px solid ${s.border}`, borderRadius: 16, padding: 28 }}>
          <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: s.text, marginBottom: 6 }}>
            Welcome back 🧡
          </h2>
          <p style={{ fontSize: 14, color: s.muted, marginBottom: 24, lineHeight: 1.6 }}>
            Sign in with your email and password.
          </p>

          {(errorParam || error) && (
            <div style={{ fontSize: 13, color: "#ff6b6b", marginBottom: 16, padding: "10px 12px", background: "rgba(230,0,35,0.08)", borderRadius: 8 }}>
              {error || "Something went wrong. Please try again."}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
                Email address
              </label>
              <input
                type="email" required placeholder="you@gmail.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 14, fontFamily: "inherit", outline: "none" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Password
                </label>
                <a href="/forgot-password" style={{ fontSize: 12, color: s.accent, textDecoration: "none" }}>
                  Forgot password?
                </a>
              </div>
              <input
                type="password" required placeholder="Your password"
                value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 14, fontFamily: "inherit", outline: "none" }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px 20px", background: loading ? "#994000" : s.accent, color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)" }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p style={{ fontSize: 13, color: s.muted, textAlign: "center", marginTop: 20 }}>
            No account?{" "}
            <a href="/signup" style={{ color: s.accent, textDecoration: "none", fontWeight: 600 }}>Sign up free</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return <Suspense fallback={null}><LoginContent /></Suspense>;
}
