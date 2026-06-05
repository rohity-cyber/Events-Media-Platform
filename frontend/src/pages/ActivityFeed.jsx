import { useEffect, useState } from "react";
import { getActivities } from "../services/activityService";
import Layout from "../components/Layout";

const ACTION_COLOR = { uploaded: "#60a5fa", deleted: "#f87171", liked: "#f472b6", commented: "#34d399", created: "#f59e0b", updated: "#a78bfa" };

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const load = async () => {
      try { const token = localStorage.getItem("token"); const data = await getActivities(token); setActivities(data); } catch (e) { console.log(e); }
    };
    load();
  }, []);

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: "760px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>Activity Feed</h1>
          <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>All platform activity in real time</p>
        </div>

        {activities.length === 0 ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "56px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", color: "#1e2d45" }}>≋</div>
            <p style={{ color: "#4b6280", margin: 0 }}>No activity recorded yet.</p>
          </div>
        ) : (
          <div style={{ position: "relative", paddingLeft: "28px" }}>
            <div style={{ position: "absolute", left: "11px", top: "16px", bottom: "16px", width: "1px", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {activities.map(a => {
                const actionWord = a.action?.split(" ")[0]?.toLowerCase();
                const dot = ACTION_COLOR[actionWord] || "#4b6280";
                return (
                  <div key={a._id} style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "-23px", top: "18px", width: "10px", height: "10px", borderRadius: "50%", background: dot, boxShadow: `0 0 6px ${dot}60` }} />
                    <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "16px 20px", transition: "border-color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${dot}30`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                      <p style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", lineHeight: 1.5 }}>
                        <span style={{ fontWeight: 700, color: "#e2e8f0" }}>{a.user?.name}</span>{" "}
                        <span style={{ color: dot }}>{a.action}</span>{" "}
                        <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{a.target}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}