export default function Testimonials() {
  const testis = [
    { quote: "Went from 200 to 48,000 monthly impressions in 6 weeks. The Indian festival calendar feature is genuinely genius — I had my entire Navratri content ready in 20 minutes.", name: "Priya Arora", role: "Home decor creator · Delhi", init: "PA", bg: "#E07B39" },
    { quote: "I run a food blog and PinDesi's Hinglish pin descriptions get way more saves than my English-only ones. The AI clearly understands Indian audiences.", name: "Sneha Reddy", role: "Food blogger · Hyderabad", init: "SR", bg: "#16A34A", delay: "0.1s" },
    { quote: "Managing Pinterest for 5 clients was a nightmare. With PinDesi's Thali plan I automated everything. Saved 15 hours a week and all accounts 3x'd in 2 months.", name: "Mohit Kapoor", role: "Social media agency · Mumbai", init: "MK", bg: "#7C3AED", delay: "0.2s" },
  ];
  return (
    <section style={{ padding: "90px 5%", background: "var(--soft)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--saffron)", marginBottom: 12 }}>Social proof</div>
        <h2 className="reveal" style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-1px", color: "var(--deep)", lineHeight: 1.1, marginBottom: 16 }}>Creators who went from 0 to growing</h2>
        <div className="reveal" style={{ width: 48, height: 4, background: "var(--saffron)", borderRadius: 2, margin: "16px 0 52px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {testis.map(t => (
            <div key={t.name} className="reveal" style={{ background: "white", borderRadius: 14, padding: 24, border: "1px solid rgba(255,107,0,0.08)", transitionDelay: t.delay }}>
              <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>
                <span style={{ color: "var(--saffron)", fontSize: 40, fontFamily: "var(--font-syne)", fontWeight: 800, lineHeight: 0, verticalAlign: "-18px", marginRight: 4 }}>&ldquo;</span>
                {t.quote}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "white", background: t.bg, fontFamily: "var(--font-syne)", flexShrink: 0 }}>{t.init}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--deep)", fontFamily: "var(--font-syne)" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
