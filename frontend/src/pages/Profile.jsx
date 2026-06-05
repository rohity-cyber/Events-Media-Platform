import { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";
import Layout from "../components/Layout";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const token = localStorage.getItem("token"); const data = await getProfile(token); setUser(data); }
      catch (e) { console.log(e); } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <Layout>
      <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", color: "#4b6280", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "16px", height: "16px", border: "2px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        Loading profile…
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: "820px" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 28px", color: "#f1f5f9" }}>Profile</h1>

        {/* Hero */}
        <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "32px", marginBottom: "16px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "22px", flexWrap: "wrap" }}>
            <div style={{ width: "84px", height: "84px", borderRadius: "50%", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", fontWeight: 700, color: "#080d1a", flexShrink: 0, boxShadow: "0 0 0 4px rgba(245,158,11,0.2)" }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "24px", margin: "0 0 6px", color: "#f1f5f9" }}>{user.name}</h2>
              <p style={{ margin: "0 0 10px", color: "#4b6280", fontSize: "14px" }}>{user.email}</p>
              <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}>{user.role}</span>
            </div>
          </div>
        </div>

        {/* Info tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: "12px", marginBottom: "16px" }}>
          {[["Role", user.role], ["Joined", new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })], ["Favourites", user.favourites?.length || 0]].map(([title, val]) => (
            <div key={title} style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px 20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#2d4057", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>{title}</div>
              <div style={{ fontSize: "16px", fontWeight: 500, color: "#e2e8f0" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Selfie */}
        {user.referenceSelfie && (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#2d4057", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>Reference Selfie</p>
            <img src={user.referenceSelfie} alt="" style={{ width: "220px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", display: "block" }} />
          </div>
        )}
      </div>
    </Layout>
  );
}