import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const ROLES = [
  { value: "viewer",       label: "Viewer",       desc: "Browse events and media" },
  { value: "member",       label: "Member",        desc: "Like, favourite & comment" },
  { value: "photographer", label: "Photographer",  desc: "Upload and manage media" },
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "viewer" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ _id: res.data._id, name: res.data.name, email: res.data.email, role: res.data.role }));
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally { setLoading(false); }
  };

  const field = { width: "100%", padding: "12px 14px", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" };
  const lbl = { display: "block", fontSize: "11.5px", fontWeight: 600, color: "#4b6280", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "8px" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#080d1a", fontFamily: "'DM Sans', sans-serif", color: "white", padding: "40px 20px", backgroundImage: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(234,179,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 90%, rgba(37,99,235,0.07) 0%, transparent 60%)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap'); *{box-sizing:border-box} input::placeholder{color:#2d4057} input:focus,select:focus{border-color:rgba(245,158,11,0.5)!important;outline:none}`}</style>
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", margin: "0 auto 18px", color: "#080d1a" }}>◈</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "26px", margin: "0 0 8px", color: "#f1f5f9" }}>Create Account</h1>
          <p style={{ color: "#4b6280", fontSize: "13.5px", margin: 0 }}>Join Event Media Platform</p>
        </div>
        <div style={{ background: "rgba(15,22,38,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "36px 32px" }}>
          <form onSubmit={handleSubmit}>
            {[["name","Name","text","Alex Johnson"],["email","Email","email","you@example.com"],["password","Password","password","••••••••"]].map(([name,lbl_,type,ph]) => (
              <div key={name} style={{ marginBottom: "16px" }}>
                <label style={lbl}>{lbl_}</label>
                <input name={name} type={type} placeholder={ph} onChange={handleChange} style={field} />
              </div>
            ))}
            <div style={{ marginBottom: "26px" }}>
              <label style={lbl}>Role</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {ROLES.map(r => (
                  <label key={r.value} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "10px", cursor: "pointer", border: form.role === r.value ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.07)", background: form.role === r.value ? "rgba(245,158,11,0.07)" : "rgba(8,13,26,0.4)", transition: "all 0.18s" }}>
                    <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={handleChange} style={{ accentColor: "#f59e0b" }} />
                    <div>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: form.role === r.value ? "#f59e0b" : "#e2e8f0" }}>{r.label}</div>
                      <div style={{ fontSize: "12px", color: "#4b6280" }}>{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#d97706,#f59e0b)", color: "#080d1a", border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "14px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "24px 0" }} />
          <p style={{ textAlign: "center", margin: 0, fontSize: "13.5px", color: "#4b6280" }}>
            Already have an account?{" "}<Link to="/" style={{ color: "#f59e0b", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}