"use client";
import PayButton from "./PayButton";

export default function Pricing() {
  const plans = [
    {
      key: "chai",
      name: "Chai ☕", price: "0", tagline: "Forever free, no card needed",
      features: ["10 AI-generated pins/month","Schedule up to 15 pins","3 trending niches","Basic analytics","1 Pinterest account"],
      cta: "Start for free", featured: false,
    },
    {
      key: "biryani",
      name: "Biryani 🍛", price: "499", tagline: "Less than a Netflix plan",
      features: ["Unlimited AI pin generation","200 scheduled pins/month","All 9 Indian niches","Festival trend calendar","Full analytics + insights","150+ Canva templates","Hinglish content mode","3 Pinterest accounts"],
      cta: "Get Biryani Plan →", featured: true, badge: "Most Popular",
    },
    {
      key: "thali",
      name: "Thali 🍽️", price: "1499", tagline: "For agencies & power users",
      features: ["Everything in Biryani","Unlimited scheduling","10 Pinterest accounts","White-label dashboard","Pinterest API access","Team collaboration","Priority support (WhatsApp)","Custom niche training"],
      cta: "Get Thali Plan →", featured: false,
    },
  ];

  const btnBase: React.CSSProperties = {
    display: "block", width: "100%", textAlign: "center",
    padding: "12px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700,
    textDecoration: "none", fontFamily: "var(--font-syne, Syne, sans-serif)",
    cursor: "pointer", border: "none", transition: "all 0.2s",
  };

  return (
    <section id="pricing" style={{ padding: "90px 5%", background: "var(--deep)", position: "relative", overflow: "hidden" }}>
      <div className="rangoli-spin-slow" style={{ position: "absolute", top: -300, right: -300, width: 700, height: 700, background: "conic-gradient(from 45deg, transparent 0deg 30deg, rgba(255,107,0,0.08) 30deg 60deg, transparent 60deg 90deg, rgba(255,170,0,0.06) 90deg 120deg, transparent 120deg 360deg)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="reveal" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--marigold)", marginBottom: 12 }}>Pricing</div>
        <h2 className="reveal" style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-1px", color: "var(--white)", lineHeight: 1.1, marginBottom: 16 }}>Desi pricing. Global results.</h2>
        <div className="reveal" style={{ width: 48, height: 4, background: "var(--saffron)", borderRadius: 2, margin: "16px 0 20px" }} />
        <p className="reveal" style={{ fontSize: 17, color: "rgba(255,250,246,0.55)", lineHeight: 1.65, maxWidth: 560, marginBottom: 52 }}>Start free, upgrade when you're ready. No dollar pricing — pure rupees.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {plans.map((p, i) => (
            <div key={p.name} className="reveal" style={{ borderRadius: 16, padding: 28, border: p.featured ? "none" : "1px solid rgba(255,250,246,0.1)", background: p.featured ? "var(--saffron)" : "rgba(255,250,246,0.04)", position: "relative", transitionDelay: `${i*0.1}s` }}>
              {p.badge && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--marigold)", color: "var(--deep)", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 100, fontFamily: "var(--font-syne, Syne)", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{p.badge}</div>}
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, color: p.featured ? "rgba(255,255,255,0.75)" : "rgba(255,250,246,0.6)", fontFamily: "var(--font-syne, Syne)" }}>{p.name}</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "var(--white)", fontFamily: "var(--font-syne, Syne)", letterSpacing: "-1.5px", lineHeight: 1, marginBottom: 4 }}>
                <sup style={{ fontSize: 20, verticalAlign: "super" }}>₹</sup>{p.price}
                <sub style={{ fontSize: 14, color: p.featured ? "rgba(255,255,255,0.65)" : "rgba(255,250,246,0.5)", fontWeight: 400, verticalAlign: "baseline" }}>/mo</sub>
              </div>
              <div style={{ fontSize: 13, color: p.featured ? "rgba(255,255,255,0.7)" : "rgba(255,250,246,0.45)", marginBottom: 24 }}>{p.tagline}</div>
              <div style={{ height: 1, background: p.featured ? "rgba(255,255,255,0.25)" : "rgba(255,250,246,0.1)", margin: "20px 0" }} />
              <ul style={{ listStyle: "none", marginBottom: 28 }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: p.featured ? "rgba(255,255,255,0.9)" : "rgba(255,250,246,0.7)", padding: "6px 0", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: p.featured ? "white" : "var(--marigold)", fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              {p.key === "chai" && (
                <a href="/dashboard" style={{ ...btnBase, border: "1.5px solid rgba(255,250,246,0.2)", background: "transparent", color: "var(--white)" }}>
                  {p.cta}
                </a>
              )}
              {p.key === "biryani" && (
                <PayButton plan="biryani" label={p.cta} style={{ ...btnBase, background: "white", color: "var(--saffron)" }} />
              )}
              {p.key === "thali" && (
                <PayButton plan="thali" label={p.cta} style={{ ...btnBase, border: "1.5px solid rgba(255,250,246,0.2)", background: "transparent", color: "var(--white)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
