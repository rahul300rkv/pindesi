export default function Features() {
  const features = [
    { icon:"🤖", title:"AI Pin Generator", desc:"Generate 30 days of pin content in minutes. Titles, descriptions, and hashtags all optimised for Indian search behaviour on Pinterest." },
    { icon:"🪔", title:"Indian Trend Calendar", desc:"Never miss a festival moment. PinDesi auto-suggests Diwali, Holi, Navratri, Eid, and regional festival content weeks in advance.", delay:"0.1s" },
    { icon:"📌", title:"Smart Scheduler", desc:"Schedule up to 200 pins per month. Our algorithm picks the optimal IST posting windows based on when Indian Pinterest users are most active.", delay:"0.2s" },
    { icon:"📊", title:"Growth Analytics", desc:"Track impressions, saves, and clicks with plain-language insights. No jargon — just actionable advice on what's working for you.", delay:"0.3s" },
    { icon:"🎨", title:"Canva Pin Templates", desc:"150+ Canva templates built for Indian niches. Rangoli-inspired borders, festival palettes, Devanagari-friendly layouts." },
    { icon:"🌐", title:"Hindi + English Support", desc:"Generate pin content in pure English, Hinglish, or Hindi. Reach audiences across Bharat, not just metro cities.", delay:"0.1s" },
  ];
  return (
    <section id="features" style={{ padding: "90px 5%", background: "var(--white)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 12 }}>Features</div>
        <h2 className="reveal" style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-1px", color: "var(--deep)", lineHeight: 1.1, marginBottom: 16 }}>Everything a desi creator needs</h2>
        <div className="reveal" style={{ width: 48, height: 4, background: "var(--saffron)", borderRadius: 2, margin: "16px 0 52px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 28 }}>
          {features.map(f => (
            <div key={f.title} className="reveal" style={{ borderRadius: 14, padding: 28, border: "1px solid rgba(255,107,0,0.1)", background: "white", transitionDelay: f.delay }}>
              <div style={{ width: 48, height: 48, background: "var(--saffron-pale)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--deep)", marginBottom: 8, fontFamily: "var(--font-syne)" }}>{f.title}</div>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
