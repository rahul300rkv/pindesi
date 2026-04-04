"use client";
import { useState } from "react";
import WaitlistModal from "./WaitlistModal";

export default function CTABanner() {
  const [show, setShow] = useState(false);
  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #FF6B00 0%, #FF4500 100%)", textAlign: "center", padding: "80px 5%", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-conic-gradient(rgba(255,255,255,0.04) 0% 25%, transparent 0% 50%)", backgroundSize: "40px 40px" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-1px", color: "white", marginBottom: 12, fontFamily: "var(--font-syne, Syne, sans-serif)" }}>Ready to grow your Pinterest, desi style?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 17, marginBottom: 32, lineHeight: 1.65 }}>Join 2,400+ Indian creators. Free to start. No credit card. No dollar billing.</p>
          <button onClick={() => setShow(true)} style={{ background: "white", color: "#FF6B00", padding: "14px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)", display: "inline-flex", alignItems: "center", gap: 8 }}>
            Join the waitlist → 🎉
          </button>
        </div>
      </section>
      {show && <WaitlistModal onClose={() => setShow(false)} />}
    </>
  );
}
