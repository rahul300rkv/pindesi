export default function Footer() {
  return (
    <footer style={{ background: "var(--deep)", padding: "48px 5%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--white)", fontFamily: "var(--font-syne)" }}>
        Pin<span style={{ color: "var(--saffron)" }}>Desi</span>
      </div>
      <ul style={{ display: "flex", gap: 24, listStyle: "none", flexWrap: "wrap" }}>
        {["Features","Pricing","Blog","Support","Privacy"].map(l => (
          <li key={l}><a href="#" style={{ fontSize: 13, color: "rgba(255,250,246,0.45)", textDecoration: "none" }}>{l}</a></li>
        ))}
      </ul>
      <div style={{ fontSize: 12, color: "rgba(255,250,246,0.3)" }}>© 2026 PinDesi · Made with 🧡 in India</div>
    </footer>
  );
}
