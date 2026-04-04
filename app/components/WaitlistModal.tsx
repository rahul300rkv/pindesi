"use client";
import { useState } from "react";

const NICHES = [
  "Indian Home Decor 🏠",
  "Desi Recipes 🍛",
  "Bollywood Fashion 👗",
  "Budget Travel India ✈️",
  "Mehendi & Bridal 💍",
  "Festival & DIY 🪔",
  "Indian Skincare ✨",
  "Yoga & Wellness 🧘",
  "Finance & Hustles 💰",
];

export default function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", niche: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.niche) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) setStep("success");
      else setError(data.error || "Something went wrong");
    } catch { setError("Network error, please try again"); }
    finally { setLoading(false); }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(26,10,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#FFFAF6", borderRadius: 20, padding: 36, maxWidth: 460, width: "100%", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#7A5C4A" }}>✕</button>

        {step === "form" ? (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Early access</div>
            <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 26, fontWeight: 800, color: "#1A0A00", marginBottom: 8, letterSpacing: "-0.5px" }}>
              Join the waitlist 🎉
            </h2>
            <p style={{ fontSize: 14, color: "#7A5C4A", lineHeight: 1.65, marginBottom: 24 }}>
              Early members get <strong style={{ color: "#FF6B00" }}>3 months of Biryani plan free</strong>. No credit card, no spam.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#7A5C4A", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Your name</label>
                <input
                  type="text" placeholder="Priya, Rahul, Sneha..."
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(45,18,0,0.15)", fontSize: 14, fontFamily: "inherit", background: "white", color: "#1A0A00", outline: "none" }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#7A5C4A", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Email address *</label>
                <input
                  type="email" placeholder="you@gmail.com" required
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(45,18,0,0.15)", fontSize: 14, fontFamily: "inherit", background: "white", color: "#1A0A00", outline: "none" }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#7A5C4A", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Your main niche *</label>
                <select
                  required value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid rgba(45,18,0,0.15)", fontSize: 14, fontFamily: "inherit", background: "white", color: form.niche ? "#1A0A00" : "#7A5C4A", outline: "none" }}
                >
                  <option value="">Select your niche...</option>
                  {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              {error && <div style={{ fontSize: 13, color: "#E60023", marginBottom: 14, padding: "8px 12px", background: "#FFF0F0", borderRadius: 6 }}>{error}</div>}

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px 20px", background: loading ? "#FFB380" : "#FF6B00", color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)", letterSpacing: "-0.2px" }}>
                {loading ? "Joining..." : "Join the waitlist →"}
              </button>
              <p style={{ fontSize: 11, color: "#7A5C4A", textAlign: "center", marginTop: 12 }}>No spam. Unsubscribe anytime. Made in India 🧡</p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 26, fontWeight: 800, color: "#1A0A00", marginBottom: 12 }}>You're on the list!</h2>
            <p style={{ fontSize: 15, color: "#7A5C4A", lineHeight: 1.7, marginBottom: 8 }}>
              Check your inbox — we've sent you a welcome email with tips to get your Pinterest ready while you wait.
            </p>
            <p style={{ fontSize: 14, color: "#FF6B00", fontWeight: 600, marginBottom: 28 }}>Early access · 3 months Biryani plan free 🍛</p>
            <button onClick={onClose} style={{ padding: "12px 32px", background: "#FF6B00", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
