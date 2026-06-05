import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../services/dashboardService";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

const QUICK = [
  { to: "/events",        icon: "◆", label: "Events",        desc: "Browse & create events" },
  { to: "/albums",        icon: "▤", label: "Albums",         desc: "Photo collections" },
  { to: "/upload",        icon: "⊕", label: "Upload Media",   desc: "Add images & videos" },
  { to: "/gallery",       icon: "⊞", label: "Gallery",        desc: "All media" },
  { to: "/favourites",    icon: "◇", label: "Favourites",     desc: "Saved items" },
  { to: "/search",        icon: "⊙", label: "Search",         desc: "Advanced search" },
  { to: "/notifications", icon: "◉", label: "Notifications",  desc: "Your alerts" },
  { to: "/profile",       icon: "◎", label: "Profile",        desc: "Account details" },
  { to: "/my-photos",     icon: "▣", label: "My Photos",      desc: "Face-matched photos" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try { const token = localStorage.getItem("token"); const data = await getStats(token); setStats(data); } catch (e) { console.log(e); }
    };
    load();
  }, []);

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>Dashboard</h1>
          <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>Platform overview at a glance</p>
        </div>

        {stats && (
          <>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#2d4057", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>Platform Stats</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: "14px", marginBottom: "44px" }}>
              <StatCard title="Users"  value={stats.totalUsers}  icon="◎" accent="#f59e0b" />
              <StatCard title="Events" value={stats.totalEvents} icon="◆" accent="#60a5fa" />
              <StatCard title="Albums" value={stats.totalAlbums} icon="▤" accent="#a78bfa" />
              <StatCard title="Media"  value={stats.totalMedia}  icon="⊞" accent="#34d399" />
              <StatCard title="Images" value={stats.totalImages} icon="▣" accent="#f472b6" />
              <StatCard title="Videos" value={stats.totalVideos} icon="▶" accent="#fb923c" />
            </div>
          </>
        )}

        <p style={{ fontSize: "11px", fontWeight: 600, color: "#2d4057", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>Quick Access</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "12px" }}>
          {QUICK.map(({ to, icon, label, desc }) => (
            <Link key={to} to={to} style={{ textDecoration: "none" }}>
              <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", transition: "all 0.2s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.25)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = ""; }}>
                <div style={{ fontSize: "18px", color: "#f59e0b", marginBottom: "10px", opacity: 0.8 }}>{icon}</div>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#e2e8f0", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "12px", color: "#4b6280" }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}