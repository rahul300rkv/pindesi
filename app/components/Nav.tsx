"use client";
import { useState } from "react";
import WaitlistModal from "./WaitlistModal";

export default function Nav() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 5%", background: "rgba(255,250,246,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,107,0,0.12)" }}>
        <div style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 22, fontWeight: 800, color: "#1A0A00", letterSpacing: "-0.5px" }}>
          Pin<span style={{ color: "#FF6B00" }}>Desi</span>
        </div>
        <ul style={{ display: "flex", alignItems: "center", gap: 24, listStyle: "none" }}>
          <li><a href="#how" style={{ fontSize: 14, color: "#7A5C4A", textDecoration: "none", fontWeight: 500 }}>How it works</a></li>
          <li><a href="#features" style={{ fontSize: 14, color: "#7A5C4A", textDecoration: "none", fontWeight: 500 }}>Features</a></li>
          <li><a href="#pricing" style={{ fontSize: 14, color: "#7A5C4A", textDecoration: "none", fontWeight: 500 }}>Pricing</a></li>
          <li><a href="/login" style={{ fontSize: 14, color: "#7A5C4A", textDecoration: "none", fontWeight: 500 }}>Sign in</a></li>
          <li>
            <a href="/signup" style={{ background: "#FF6B00", color: "white", padding: "9px 20px", borderRadius: 6, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "none" }}>
              Sign up free →
            </a>
          </li>
        </ul>
      </nav>
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
    </>
  );
}
