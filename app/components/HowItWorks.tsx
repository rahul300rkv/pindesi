export default function HowItWorks() {
  const steps = [
    { n:"01", icon:"🎯", title:"Choose your niche", desc:"Pick from 9 trending Indian niches — from home decor to Bollywood fashion. PinDesi knows exactly what's hot for Indian audiences right now." },
    { n:"02", icon:"✨", title:"AI generates your pins", desc:"Our AI writes titles, descriptions and hashtags in Hindi-English mix that actually converts. Just upload or pick an image and you're done.", delay:"0.1s" },
    { n:"03", icon:"📅", title:"Auto-schedule & grow", desc:"Set your posting times (we recommend 8AM, 1PM, 9PM IST) and PinDesi posts automatically. Watch your impressions climb week after week.", delay:"0.2s" },
  ];
  return (
    <section id="how" style={{ padding: "90px 5%", background: "var(--soft)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 12 }}>How it works</div>
        <h2 className="reveal" style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-1px", color: "var(--deep)", lineHeight: 1.1, marginBottom: 16 }}>Zero to viral in 3 steps</h2>
        <div className="reveal" style={{ width: 48, height: 4, background: "var(--saffron)", borderRadius: 2, margin: "16px 0 20px" }} />
        <p className="reveal" style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.65, maxWidth: 560 }}>No design skills. No Pinterest expertise. Just pick your niche and let PinDesi do the heavy lifting.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, marginTop: 52 }}>
          {steps.map(s => (
            <div key={s.n} className="reveal" style={{ background: "white", borderRadius: 14, padding: 28, border: "1px solid rgba(255,107,0,0.1)", transitionDelay: s.delay }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: "rgba(255,107,0,0.1)", lineHeight: 1, marginBottom: 12, fontFamily: "var(--font-syne)" }}>{s.n}</div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--deep)", marginBottom: 8, fontFamily: "var(--font-syne)" }}>{s.title}</div>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
