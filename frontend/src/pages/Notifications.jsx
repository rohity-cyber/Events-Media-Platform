import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";
import socket from "../services/socket";
import Layout from "../components/Layout";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) socket.emit("registerUser", user._id);

    const load = async () => {
      try { const data = await getNotifications(token); setNotifications(data); } catch (e) { console.log(e); }
    };
    load();

    socket.on("newNotification", (n) => setNotifications(prev => [n, ...prev]));
    return () => socket.off("newNotification");
  }, []);

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: "720px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>Notifications</h1>
            <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>{notifications.length} notification{notifications.length !== 1 ? "s" : ""}</p>
          </div>
          {notifications.length > 0 && (
            <span style={{ padding: "4px 12px", borderRadius: "20px", background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)", fontSize: "12px", fontWeight: 600 }}>
              {notifications.length} new
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "56px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", color: "#1e2d45" }}>◉</div>
            <p style={{ color: "#4b6280", margin: 0 }}>You're all caught up! No notifications yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {notifications.map((n, i) => (
              <div key={n._id || i} style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "18px 22px", display: "flex", gap: "16px", alignItems: "flex-start", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#f59e0b", flexShrink: 0 }}>◉</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px", fontSize: "14px", color: "#e2e8f0", lineHeight: 1.5 }}>{n.message}</p>
                  {n.createdAt && <small style={{ color: "#2d4057", fontSize: "11.5px" }}>{new Date(n.createdAt).toLocaleString()}</small>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}