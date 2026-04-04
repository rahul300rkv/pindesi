"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const NICHES = ["Indian Home Decor","Desi Recipes","Bollywood Fashion","Budget Travel India","Mehendi & Bridal","Festival & DIY","Indian Skincare","Yoga & Wellness","Finance & Hustles"];

const QUEUE = [
  { id:1, title:"10 Indian home decor ideas that cost under ₹500", niche:"Home Decor", time:"8:00 AM", status:"live", bg:"linear-gradient(135deg,#F5EDE6,#E8D0BA)" },
  { id:2, title:"Easy Dal Makhani recipe | 30 minutes only", niche:"Recipes", time:"1:00 PM", status:"scheduled", bg:"linear-gradient(135deg,#FFF3E8,#FFD4A8)" },
  { id:3, title:"Mehendi designs for brides 2026 — best picks", niche:"Bridal", time:"9:00 PM", status:"scheduled", bg:"linear-gradient(135deg,#FCE4EC,#F8BBD0)" },
  { id:4, title:"Diwali living room makeover on a budget", niche:"Festival", time:"8:00 AM +1", status:"draft", bg:"linear-gradient(135deg,#FFF8E1,#FFECB3)" },
  { id:5, title:"Rajasthan trip under ₹15,000 — complete guide", niche:"Travel", time:"1:00 PM +1", status:"draft", bg:"linear-gradient(135deg,#E3F2FD,#BBDEFB)" },
];

function DashboardContent() {
  const params = useSearchParams();
  const welcome = params.get("welcome");
  const [activeTab, setActiveTab] = useState("queue");
  const [niche, setNiche] = useState(NICHES[0]);
  const [tone, setTone] = useState("Inspirational");
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [pins, setPins] = useState<{title:string;description:string;hashtags:string[];board:string}[]>([]);
  const [genError, setGenError] = useState("");

  async function generatePins() {
    setGenerating(true); setPins([]); setGenError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `Generate ${count} Pinterest pin ideas for the niche: "${niche}" targeted at Indian audiences. Tone: ${tone}. For each pin provide: title (max 80 chars), description (150-200 chars with CTA), hashtags (5-7 including Indian ones), board name. Respond ONLY with valid JSON array, no markdown: [{"title":"...","description":"...","hashtags":["..."],"board":"..."}]` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((c: {text?:string}) => c.text || "").join("") || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      setPins(JSON.parse(cleaned));
    } catch {
      setGenError("Generation failed. Please try again.");
    } finally { setGenerating(false); }
  }

  const s = { active: "#FF6B00", bg: "#1A0A00", card: "rgba(255,250,246,0.05)", border: "rgba(255,250,246,0.1)", text: "#FFFAF6", muted: "rgba(255,250,246,0.5)", soft: "#F5EDE6" };

  return (
    <div style={{ minHeight: "100vh", background: s.bg, color: s.text, fontFamily: "var(--font-dm, DM Sans, sans-serif)" }}>

      {/* Welcome banner */}
      {welcome && (
        <div style={{ background: "#FF6B00", padding: "12px 24px", textAlign: "center", fontSize: 14, fontWeight: 600 }}>
          🎉 Welcome to PinDesi! Your account is ready. Start generating pins below.
        </div>
      )}

      {/* Sidebar + main layout */}
      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* Sidebar */}
        <aside style={{ width: 220, borderRight: `1px solid ${s.border}`, padding: "24px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
          <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${s.border}`, marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 20, fontWeight: 800 }}>
              Pin<span style={{ color: s.active }}>Desi</span>
            </div>
            <div style={{ fontSize: 11, color: s.muted, marginTop: 2 }}>Chai plan · Free</div>
          </div>

          {[
            { id:"queue", icon:"📌", label:"Pin Queue" },
            { id:"generate", icon:"✨", label:"AI Generator" },
            { id:"analytics", icon:"📊", label:"Analytics" },
            { id:"calendar", icon:"🪔", label:"Festival Calendar" },
            { id:"settings", icon:"⚙️", label:"Settings" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 20px", background: activeTab === tab.id ? "rgba(255,107,0,0.15)" : "none", border: "none", cursor: "pointer", color: activeTab === tab.id ? s.active : s.muted, fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 400, fontFamily: "inherit", borderLeft: activeTab === tab.id ? `3px solid ${s.active}` : "3px solid transparent", textAlign: "left" }}>
              <span style={{ fontSize: 16 }}>{tab.icon}</span> {tab.label}
            </button>
          ))}

          <div style={{ margin: "24px 16px 0", background: "rgba(255,107,0,0.12)", borderRadius: 10, padding: "14px", border: "1px solid rgba(255,107,0,0.2)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.active, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Chai plan</div>
            <div style={{ fontSize: 12, color: s.muted, lineHeight: 1.5, marginBottom: 10 }}>10/10 pins used this month</div>
            <div style={{ height: 4, background: "rgba(255,250,246,0.1)", borderRadius: 2, marginBottom: 10 }}>
              <div style={{ height: "100%", width: "100%", background: s.active, borderRadius: 2 }} />
            </div>
            <button style={{ width: "100%", background: s.active, color: "white", border: "none", borderRadius: 6, padding: "8px 0", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
              Upgrade → Biryani 🍛
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>

          {/* Pin Queue */}
          {activeTab === "queue" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>Pin Queue</h1>
                  <p style={{ fontSize: 14, color: s.muted, marginTop: 4 }}>5 pins scheduled · Next post at 8:00 AM IST</p>
                </div>
                <button onClick={() => setActiveTab("generate")} style={{ background: s.active, color: "white", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                  + Generate pins
                </button>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
                {[["Monthly Views","84.2K","↑ 212%","#22c55e"],["Saves","3,241","↑ 98%","#22c55e"],["Clicks","891","↑ 43%","#22c55e"],["Pins Queued","5","14 days","#FFAA00"]].map(([l,v,u,c]) => (
                  <div key={l} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{l}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-syne, Syne, sans-serif)", marginBottom: 2 }}>{v}</div>
                    <div style={{ fontSize: 11, color: c, fontWeight: 600 }}>{u}</div>
                  </div>
                ))}
              </div>

              {/* Queue list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {QUEUE.map(pin => (
                  <div key={pin.id} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 60, borderRadius: 8, background: pin.bg, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pin.title}</div>
                      <div style={{ fontSize: 12, color: s.muted }}>{pin.niche} · {pin.time} IST</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: pin.status === "live" ? "rgba(34,197,94,0.15)" : pin.status === "scheduled" ? "rgba(255,107,0,0.15)" : "rgba(255,250,246,0.08)", color: pin.status === "live" ? "#22c55e" : pin.status === "scheduled" ? s.active : s.muted }}>
                        {pin.status === "live" ? "● Live" : pin.status === "scheduled" ? "⏰ Scheduled" : "✏️ Draft"}
                      </span>
                      <button style={{ background: "none", border: `1px solid ${s.border}`, color: s.muted, borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Generator */}
          {activeTab === "generate" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>AI Pin Generator</h1>
              <p style={{ fontSize: 14, color: s.muted, marginBottom: 28 }}>Generate scroll-stopping pin content for Indian audiences in seconds.</p>

              <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 14, padding: 24, marginBottom: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 16, alignItems: "end" }}>
                <div>
                  <label style={{ fontSize: 12, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Niche</label>
                  <select value={niche} onChange={e => setNiche(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 13, fontFamily: "inherit" }}>
                    {NICHES.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Tone</label>
                  <select value={tone} onChange={e => setTone(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 13, fontFamily: "inherit" }}>
                    {["Inspirational","Educational / How-to","List / Roundup","Seasonal / Festive"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>Count</label>
                  <select value={count} onChange={e => setCount(+e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${s.border}`, background: "#2D1200", color: s.text, fontSize: 13, fontFamily: "inherit" }}>
                    {[3,5,7,10].map(n => <option key={n}>{n} pins</option>)}
                  </select>
                </div>
                <button onClick={generatePins} disabled={generating} style={{ padding: "10px 20px", background: generating ? "#994000" : s.active, color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: generating ? "not-allowed" : "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)", whiteSpace: "nowrap" }}>
                  {generating ? "Generating..." : "✨ Generate"}
                </button>
              </div>

              {generating && (
                <div style={{ textAlign: "center", padding: "40px 20px", color: s.muted }}>
                  <div style={{ fontSize: 32, marginBottom: 12, animation: "rangoli-spin 1s linear infinite", display: "inline-block" }}>🪔</div>
                  <div style={{ fontSize: 14 }}>Creating your pins...</div>
                </div>
              )}

              {genError && <div style={{ background: "rgba(230,0,35,0.1)", border: "1px solid rgba(230,0,35,0.2)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#ff6b6b", marginBottom: 16 }}>{genError}</div>}

              {pins.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {pins.map((pin, i) => (
                    <div key={i} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: s.active, background: "rgba(255,107,0,0.12)", padding: "3px 8px", borderRadius: 4 }}>Pin {i+1} · {pin.board}</span>
                        <button style={{ background: s.active, color: "white", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>Add to queue</button>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{pin.title}</div>
                      <div style={{ fontSize: 13, color: s.muted, lineHeight: 1.6, marginBottom: 10 }}>{pin.description}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {pin.hashtags?.map((h: string) => (
                          <span key={h} style={{ fontSize: 11, background: "rgba(255,250,246,0.06)", color: s.muted, padding: "3px 8px", borderRadius: 4 }}>{h}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics */}
          {activeTab === "analytics" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>Analytics</h1>
              <p style={{ fontSize: 14, color: s.muted, marginBottom: 28 }}>Your Pinterest growth at a glance.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
                {[["Impressions","84,200","↑ 212% this month"],["Saves","3,241","↑ 98% this month"],["Profile visits","1,089","↑ 54% this month"],["Outbound clicks","891","↑ 43% this month"],["Followers","342","↑ 28 this month"],["Avg. daily pins","3.2","Recommended: 3–5"]].map(([l,v,u]) => (
                  <div key={l} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{l}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-syne, Syne, sans-serif)", marginBottom: 4 }}>{v}</div>
                    <div style={{ fontSize: 12, color: "#22c55e" }}>{u}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "20px", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: s.active, marginBottom: 4 }}>💡 PinDesi insight</div>
                <div style={{ fontSize: 14, color: s.text, lineHeight: 1.65 }}>Your <strong>Indian Home Decor</strong> pins are getting 3× more saves than other niches. Consider posting 2 home decor pins per day instead of 1 — this could double your monthly saves within 3 weeks.</div>
              </div>
            </div>
          )}

          {/* Festival Calendar */}
          {activeTab === "calendar" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>Festival Calendar 🪔</h1>
              <p style={{ fontSize: 14, color: s.muted, marginBottom: 28 }}>Upcoming Indian festivals — never miss a content opportunity.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { fest:"Akshaya Tritiya", date:"Apr 30, 2026", days:26, niche:"Jewellery, Gifting, Home", tip:"Start pinning gifting ideas 3 weeks before" },
                  { fest:"Eid al-Adha", date:"Jun 6, 2026", days:63, niche:"Fashion, Recipes, Decor", tip:"Mehndi and outfit content peaks 1 week before" },
                  { fest:"Independence Day", date:"Aug 15, 2026", days:133, niche:"Patriotic, DIY, Recipes", tip:"Tiranga-themed home decor pins go viral" },
                  { fest:"Navratri", date:"Sep 22, 2026", days:171, niche:"Fashion, Garba, Recipes", tip:"Chaniya choli and fasting recipes peak content" },
                  { fest:"Diwali", date:"Oct 20, 2026", days:199, niche:"Decor, Gifting, Fashion, Recipes", tip:"Biggest Pinterest spike of the year for India — start 6 weeks early" },
                  { fest:"Bhai Dooj", date:"Oct 23, 2026", days:202, niche:"Gifting, Food", tip:"Sibling gifting guides and sweets recipes" },
                ].map(f => (
                  <div key={f.fest} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ textAlign: "center", minWidth: 60, background: "rgba(255,107,0,0.1)", borderRadius: 10, padding: "8px 12px" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.active, fontFamily: "var(--font-syne, Syne, sans-serif)", lineHeight: 1 }}>{f.days}</div>
                      <div style={{ fontSize: 10, color: s.muted, textTransform: "uppercase" }}>days</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{f.fest} <span style={{ fontSize: 12, color: s.muted, fontWeight: 400 }}>· {f.date}</span></div>
                      <div style={{ fontSize: 12, color: s.active, marginBottom: 4 }}>Niches: {f.niche}</div>
                      <div style={{ fontSize: 12, color: s.muted }}>💡 {f.tip}</div>
                    </div>
                    <button style={{ background: s.active, color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--font-syne, Syne, sans-serif)" }}>
                      Generate content
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div>
              <h1 style={{ fontFamily: "var(--font-syne, Syne, sans-serif)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 28 }}>Settings</h1>
              {[
                { label: "Pinterest Account", desc: "Connect your Pinterest Business account", action: "Connect →", connected: false },
                { label: "Posting Schedule", desc: "8:00 AM · 1:00 PM · 9:00 PM IST (recommended)", action: "Edit", connected: true },
                { label: "Content Language", desc: "Currently: Hinglish (Hindi + English)", action: "Change", connected: true },
                { label: "Razorpay Billing", desc: "Chai plan · Upgrade for unlimited pins", action: "Upgrade →", connected: true },
              ].map(item => (
                <div key={item.label} style={{ background: s.card, border: `1px solid ${s.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: s.muted }}>{item.desc}</div>
                  </div>
                  <button style={{ background: item.connected ? "rgba(255,250,246,0.06)" : s.active, color: item.connected ? s.muted : "white", border: item.connected ? `1px solid ${s.border}` : "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div style={{ background: "#1A0A00", color: "#FFFAF6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
