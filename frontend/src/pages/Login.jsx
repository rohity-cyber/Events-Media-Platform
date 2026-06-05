import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ _id: res.data._id, name: res.data.name, email: res.data.email, role: res.data.role }));
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const field = { width: "100%", padding: "12px 14px", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" };
  const label = { display: "block", fontSize: "11.5px", fontWeight: 600, color: "#4b6280", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "8px" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#080d1a", fontFamily: "'DM Sans', sans-serif", color: "white", padding: "20px", backgroundImage: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(234,179,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 90%, rgba(37,99,235,0.07) 0%, transparent 60%)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap'); *{box-sizing:border-box} input::placeholder{color:#2d4057} input:focus{border-color:rgba(245,158,11,0.5)!important;box-shadow:0 0 0 3px rgba(245,158,11,0.07)}`}</style>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", margin: "0 auto 18px", color: "#080d1a" }}>◈</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "26px", margin: "0 0 8px", color: "#f1f5f9" }}>Event Media Platform</h1>
          <p style={{ color: "#4b6280", fontSize: "13.5px", margin: 0 }}>Sign in to continue</p>
        </div>
        <div style={{ background: "rgba(15,22,38,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "36px 32px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label style={label}>Email</label>
              <input name="email" type="email" placeholder="you@example.com" onChange={handleChange} style={field} />
            </div>
            <div style={{ marginBottom: "26px" }}>
              <label style={label}>Password</label>
              <input name="password" type="password" placeholder="••••••••" onChange={handleChange} style={field} />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg,#d97706,#f59e0b)", color: "#080d1a", border: "none", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "14px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "24px 0" }} />
          <p style={{ textAlign: "center", margin: 0, fontSize: "13.5px", color: "#4b6280" }}>
            New here?{" "}<Link to="/register" style={{ color: "#f59e0b", fontWeight: 600, textDecoration: "none" }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}