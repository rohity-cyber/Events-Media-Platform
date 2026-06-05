export default function StatCard({ title, value, icon, accent }) {
  const color = accent || "#f59e0b";
  return (
    <div
      style={{ background: "rgba(15,22,38,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "22px 24px", position: "relative", overflow: "hidden", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "default" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Corner glow */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px", background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
      {/* Bottom accent line */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "40%", height: "2px", background: `linear-gradient(90deg, ${color}55, transparent)`, borderRadius: "0 2px 0 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <p style={{ color: "#2d4057", fontSize: "11px", fontWeight: 600, margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</p>
        {icon && <span style={{ fontSize: "16px", opacity: 0.55, color }}>{icon}</span>}
      </div>

      <h2 style={{ fontSize: "36px", margin: 0, fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "#f1f5f9", lineHeight: 1, letterSpacing: "-0.02em" }}>
        {value}
      </h2>
    </div>
  );
}