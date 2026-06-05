import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../services/profileService";
import { getStats } from "../services/dashboardService";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

const ROLE_ACCENT = { admin: "#f59e0b", photographer: "#60a5fa", member: "#34d399", viewer: "#a78bfa" };

const ROLE_CARDS = {
  admin: [
    { to: "/activity",    icon: "≋", label: "Activity Feed",    desc: "All platform actions" },
    { to: "/admin-users", icon: "⊛", label: "User Management",  desc: "Manage roles & accounts" },
    { to: "/moderation",  icon: "⊘", label: "Media Moderation", desc: "Review uploads" },
  ],
  photographer: [
    { to: "/upload",  icon: "⊕", label: "Upload Media",  desc: "Add images & videos" },
    { to: "/albums",  icon: "▤", label: "Manage Albums", desc: "Organise collections" },
    { to: "/gallery", icon: "⊞", label: "View Gallery",  desc: "Browse all media" },
    { to: "/events",  icon: "◆", label: "Events",        desc: "Manage events" },
  ],
  member: [
    { to: "/my-photos",     icon: "▣", label: "My Photos",     desc: "Face-matched photos" },
    { to: "/favourites",    icon: "◇", label: "Favourites",    desc: "Saved media" },
    { to: "/notifications", icon: "◉", label: "Notifications", desc: "Your alerts" },
    { to: "/gallery",       icon: "⊞", label: "Gallery",       desc: "Browse all media" },
  ],
};
ROLE_CARDS.viewer = ROLE_CARDS.member;

const ROLE_TITLE = { admin: "Admin Dashboard", photographer: "Photographer Dashboard", member: "Member Dashboard", viewer: "Viewer Dashboard" };

export default function RoleDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const profile = await getProfile(token);
        setUser(profile);
        const s = await getStats(token);
        setStats(s);
      } catch (e) { console.log(e); }
    };
    load();
  }, []);

  if (!user) return (
    <Layout>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#4b6280", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ width: "18px", height: "18px", border: "2px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        Loading…
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </Layout>
  );

  const accent = ROLE_ACCENT[user.role] || "#f59e0b";
  const cards = ROLE_CARDS[user.role] || [];

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {/* Welcome banner */}
        <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "28px 32px", marginBottom: "36px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "220px", height: "220px", background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: `linear-gradient(135deg,${accent}aa,${accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#080d1a", flexShrink: 0, boxShadow: `0 0 0 3px ${accent}25` }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "26px", margin: "0 0 8px", color: "#f1f5f9" }}>Welcome back, {user.name}</h1>
              <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", background: `${accent}20`, color: accent, border: `1px solid ${accent}35` }}>{user.role}</span>
            </div>
          </div>
        </div>

        {/* Admin stats */}
        {user.role === "admin" && stats && (
          <>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#2d4057", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>Platform Overview</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: "14px", marginBottom: "36px" }}>
              <StatCard title="Users"  value={stats.totalUsers}  icon="◎" accent="#f59e0b" />
              <StatCard title="Events" value={stats.totalEvents} icon="◆" accent="#60a5fa" />
              <StatCard title="Albums" value={stats.totalAlbums} icon="▤" accent="#a78bfa" />
              <StatCard title="Media"  value={stats.totalMedia}  icon="⊞" accent="#34d399" />
            </div>
          </>
        )}

        <p style={{ fontSize: "11px", fontWeight: 600, color: "#2d4057", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>{ROLE_TITLE[user.role]}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "12px" }}>
          {cards.map(c => (
            <Link key={c.to} to={c.to} style={{ textDecoration: "none" }}>
              <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "22px", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = `${accent}35`; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ fontSize: "18px", color: accent, marginBottom: "10px", opacity: 0.85 }}>{c.icon}</div>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#e2e8f0", marginBottom: "4px" }}>{c.label}</div>
                <div style={{ fontSize: "12px", color: "#4b6280" }}>{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}