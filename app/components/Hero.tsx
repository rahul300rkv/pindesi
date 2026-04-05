"use client";
export default function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}>
      {/* Rangoli BG */}
      <div style={{ position: "absolute", inset: 0, background: "var(--white)" }} />
      <div className="rangoli-spin" style={{
        position: "absolute", top: -200, right: -200, width: 700, height: 700,
        background: "conic-gradient(from 0deg, transparent 0deg 30deg, rgba(255,107,0,0.06) 30deg 60deg, transparent 60deg 90deg, rgba(255,170,0,0.05) 90deg 120deg, transparent 120deg 150deg, rgba(255,107,0,0.04) 150deg 180deg, transparent 180deg 210deg, rgba(255,170,0,0.06) 210deg 240deg, transparent 240deg 270deg, rgba(255,107,0,0.05) 270deg 300deg, transparent 300deg 330deg, rgba(255,170,0,0.04) 330deg 360deg)",
        borderRadius: "50%",
      }} />
      <div style={{ position: "absolute", bottom: -150, left: -100, width: 500, height: 500, background: "radial-gradient(ellipse, rgba(255,107,0,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>
        {/* Left */}
        <div>
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--saffron-pale)", border: "1px solid rgba(255,107,0,0.2)", borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "var(--saffron)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 24 }}>
            <div className="pulse-dot" style={{ width: 6, height: 6, background: "var(--saffron)", borderRadius: "50%" }} />
            Made for Indian creators
          </div>

          <h1 className="fade-up-1" style={{ fontSize: "clamp(40px,5vw,64px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-1.5px", color: "var(--deep)", marginBottom: 20 }}>
            Pinterest growth,{" "}
            <span style={{ color: "var(--saffron)", position: "relative", display: "inline-block" }}>
              desi style
              <span style={{ position: "absolute", bottom: -4, left: 0, right: 0, height: 4, background: "var(--marigold)", borderRadius: 2, transform: "skewX(-5deg)", display: "block" }} />
            </span>
          </h1>

          <p className="fade-up-2" style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.65, marginBottom: 36, maxWidth: 480 }}>
            Schedule pins, generate AI content for Indian trending niches, and grow your Pinterest from zero — all in one place. Built for India, priced for India.
          </p>

          <div className="fade-up-3" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <a href="/signup" style={{ background: "var(--saffron)", color: "white", padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-syne)", letterSpacing: "-0.2px", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Start for free →
            </a>
            <a href="#how" style={{ color: "var(--ink)", padding: "14px 24px", borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: "none", border: "1.5px solid rgba(45,18,0,0.15)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              See how it works
            </a>
          </div>

          <div className="fade-up-4" style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex" }}>
              {[["PA","#E07B39"],["SR","#C05A1F"],["MK","#9B4514"],["RG","#7A3310"]].map(([init, bg]) => (
                <div key={init} style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--white)", marginRight: -10, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "white", background: bg, fontFamily: "var(--font-syne)" }}>{init}</div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>2,400+ Indian creators</strong> already growing<br />
              ⭐⭐⭐⭐⭐ &nbsp;4.9 rating on ProductHunt India
            </div>
          </div>
        </div>

        {/* Right — mock dashboard */}
        <div style={{ position: "relative" }}>
          <div className="float-anim" style={{ position: "absolute", top: -20, right: -30, background: "white", borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 24px rgba(45,18,0,0.12)", border: "1px solid rgba(255,107,0,0.12)", fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", zIndex: 10 }}>
            📈 +340% impressions this week
          </div>
          <div className="float-anim-delay2" style={{ position: "absolute", bottom: 30, left: -30, background: "white", borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 24px rgba(45,18,0,0.12)", border: "1px solid rgba(255,107,0,0.12)", fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", zIndex: 10 }}>
            🪔 Diwali content auto-scheduled
          </div>

          <div style={{ background: "white", borderRadius: 16, border: "1px solid rgba(255,107,0,0.15)", boxShadow: "0 20px 60px rgba(45,18,0,0.12), 0 4px 16px rgba(255,107,0,0.08)", overflow: "hidden" }}>
            <div style={{ background: "var(--deep)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              {["#E60023","#FF6B00","#FFAA00"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              <span style={{ color: "rgba(255,250,246,0.4)", fontSize: 11, marginLeft: 8, fontFamily: "var(--font-dm)" }}>PinDesi Dashboard</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
                {[["Monthly Views","84K","↑ 212%"],["Saves","3.2K","↑ 98%"],["Pins Queued","47","14 days"]].map(([l,v,u]) => (
                  <div key={l} style={{ background: "var(--soft)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>{l}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--deep)", fontFamily: "var(--font-syne)" }}>{v}</div>
                    <div style={{ fontSize: 10, color: "#16a34a", fontWeight: 600 }}>{u}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[
                  ["linear-gradient(135deg,#F5EDE6,#E8D0BA)","Indian home decor ideas 2026","Live","#16a34a"],
                  ["linear-gradient(135deg,#FFF3E8,#FFD4A8)","Dahi puri recipe easy steps","3PM","#FF6B00"],
                  ["linear-gradient(135deg,#E8F5E9,#C8E6C9)","Mehendi designs bridal 2026","8PM","#7C3AED"],
                  ["linear-gradient(135deg,#E3F2FD,#BBDEFB)","Budget Rajasthan trip guide","9AM","#FF6B00"],
                  ["linear-gradient(135deg,#FCE4EC,#F8BBD0)","Indian skincare routine","1PM","#FF6B00"],
                  ["linear-gradient(135deg,#F3E5F5,#E1BEE7)","Diwali decor DIY at home","Saved","#0d9488"],
                ].map(([bg,label,badge,bc]) => (
                  <div key={label} style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "2/3", position: "relative", background: bg }}>
                    <div style={{ position: "absolute", bottom: 6, left: 6, right: 6, fontSize: 9, fontWeight: 600, color: "white", background: "rgba(0,0,0,0.55)", borderRadius: 4, padding: "3px 5px", lineHeight: 1.3 }}>{label}</div>
                    <div style={{ position: "absolute", top: 6, right: 6, fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 3, background: bc, color: "white", fontFamily: "var(--font-syne)" }}>{badge}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
