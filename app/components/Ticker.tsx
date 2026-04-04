export default function Ticker() {
  const items = ["Indian Home Decor","Desi Recipes","Bollywood Fashion","Budget Travel India","Mehendi & Bridal","Festival Decor","Indian Skincare","Yoga & Wellness","Desi Finance Hacks"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,107,0,0.12)", borderBottom: "1px solid rgba(255,107,0,0.12)", padding: "14px 0", background: "var(--saffron-pale)" }}>
      <div className="ticker-anim" style={{ display: "flex", gap: 48, whiteSpace: "nowrap", width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ fontSize: 13, fontWeight: 600, color: "var(--saffron)", fontFamily: "var(--font-syne)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 5, height: 5, background: "var(--marigold)", borderRadius: "50%" }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
