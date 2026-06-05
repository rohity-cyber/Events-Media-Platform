import { Link, useLocation } from "react-router-dom";

const NAV = {
  always: [
    { to: "/dashboard",      label: "Dashboard",     icon: "◈" },
    { to: "/role-dashboard", label: "Role Dashboard", icon: "⬡" },
    { to: "/gallery",        label: "Gallery",        icon: "⊞" },
    { to: "/profile",        label: "Profile",        icon: "◎" },
    { to: "/notifications",  label: "Notifications",  icon: "◉" },
  ],
  memberViewer: [
    { to: "/favourites", label: "Favourites", icon: "◇" },
    { to: "/my-photos",  label: "My Photos",  icon: "▣" },
  ],
  photographerAdmin: [
    { to: "/events", label: "Events",       icon: "◆" },
    { to: "/albums", label: "Albums",       icon: "▤" },
    { to: "/upload", label: "Upload Media", icon: "⊕" },
  ],
  adminOnly: [
    { to: "/activity",    label: "Activity Feed", icon: "≋" },
    { to: "/moderation",  label: "Moderation",    icon: "⊘" },
    { to: "/admin-users", label: "Admin Users",   icon: "⊛" },
    { to: "/search",      label: "Search",        icon: "⊙" },
  ],
};

function SectionLabel({ label }) {
  return (
    <div style={{ fontSize: "10px", fontWeight: 600, color: "#1e2d45", letterSpacing: "0.12em", textTransform: "uppercase", padding: "10px 14px 4px" }}>
      {label}
    </div>
  );
}

function NavLink({ to, label, icon, active }) {
  return (
    <Link to={to}
      style={{ display: "flex", alignItems: "center", gap: "11px", padding: "9px 14px", borderRadius: "10px", textDecoration: "none", fontSize: "13.5px", fontWeight: active ? 600 : 400, color: active ? "#f59e0b" : "#64748b", background: active ? "rgba(245,158,11,0.1)" : "transparent", border: active ? "1px solid rgba(245,158,11,0.18)" : "1px solid transparent", transition: "all 0.17s ease" }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#e2e8f0"; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}
    >
      <span style={{ fontSize: "14px", opacity: 0.8 }}>{icon}</span>
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const location = useLocation();
  const path = location?.pathname;

  const isPhotographerAdmin = role === "photographer" || role === "admin";
  const isMemberViewer = role === "member" || role === "viewer";

  return (
    <aside style={{
      width: "256px",
      minWidth: "256px",
      background: "rgba(10,16,28,0.96)",
      minHeight: "100vh",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      padding: "24px 14px",
      display: "flex",
      flexDirection: "column",
      position: "sticky",
      top: 0,
      height: "100vh",
      overflowY: "auto",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "4px 14px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#d97706,#f59e0b)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", color: "#080d1a", flexShrink: 0 }}>◈</div>
          <h2 style={{ margin: 0, fontSize: "15px", fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: "#f1f5f9", letterSpacing: "0.02em" }}>Event Media</h2>
        </div>
        <p style={{ color: "#1e2d45", fontSize: "10.5px", margin: "5px 0 0 42px", letterSpacing: "0.07em", textTransform: "uppercase" }}>Media Platform</p>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "10px" }} />

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "1px", flex: 1 }}>
        <SectionLabel label="General" />
        {NAV.always.map(item => <NavLink key={item.to} {...item} active={path === item.to} />)}

        {isMemberViewer && (
          <>
            <SectionLabel label="My Content" />
            {NAV.memberViewer.map(item => <NavLink key={item.to} {...item} active={path === item.to} />)}
          </>
        )}

        {isPhotographerAdmin && (
          <>
            <SectionLabel label="Content" />
            {NAV.photographerAdmin.map(item => <NavLink key={item.to} {...item} active={path === item.to} />)}
          </>
        )}

        {role === "admin" && (
          <>
            <SectionLabel label="Admin" />
            {NAV.adminOnly.map(item => <NavLink key={item.to} {...item} active={path === item.to} />)}
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.1)" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#080d1a", flexShrink: 0 }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#e2e8f0" }}>{user?.name}</div>
            <div style={{ fontSize: "10.5px", color: "#f59e0b", textTransform: "capitalize", letterSpacing: "0.04em" }}>{role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}