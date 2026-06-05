import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header style={{
      height: "72px",
      background: "rgba(8,13,26,0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Left: branding */}
      <div>
        <h3 style={{ margin: 0, fontSize: "17px", fontFamily: "'DM Serif Display', serif", fontWeight: 400, letterSpacing: "0.02em", color: "#f1f5f9" }}>
          Event Media Platform
        </h3>
        <small style={{ color: "#2d4057", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Media Management Dashboard
        </small>
      </div>

      {/* Right: user + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "15px", color: "#080d1a", flexShrink: 0, boxShadow: "0 0 0 2px rgba(245,158,11,0.25)" }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div style={{ lineHeight: "1.3" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>{user?.name}</div>
          <small style={{ color: "#2d4057", fontSize: "11px", textTransform: "capitalize", letterSpacing: "0.04em" }}>{user?.role}</small>
        </div>
        <div style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.07)" }} />
        <button
          onClick={handleLogout}
          style={{ background: "transparent", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 500, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.03em", transition: "all 0.2s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.15)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}