import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function AccessDenied() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px", opacity: 0.15, color: "#f87171" }}>⊘</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "42px", margin: "0 0 14px", color: "#f1f5f9", letterSpacing: "-0.02em" }}>Access Denied</h1>
        <p style={{ color: "#4b6280", fontSize: "16px", margin: "0 0 32px", maxWidth: "380px", lineHeight: 1.6 }}>
          You don't have permission to view this page. Contact an admin if you think this is a mistake.
        </p>
        <button onClick={() => navigate("/dashboard")}
          style={{ background: "linear-gradient(135deg,#d97706,#f59e0b)", color: "#080d1a", border: "none", padding: "12px 28px", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "14px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em" }}>
          Back to Dashboard
        </button>
      </div>
    </Layout>
  );
}