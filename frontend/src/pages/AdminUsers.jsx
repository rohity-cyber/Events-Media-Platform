import { useEffect, useState } from "react";
import { getUsers, updateRole, deleteUser } from "../services/adminService";
import Layout from "../components/Layout";

const ROLE_ACCENT = { admin: "#f59e0b", photographer: "#60a5fa", member: "#34d399", viewer: "#a78bfa" };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const loadUsers = async () => {
    try { setLoading(true); const data = await getUsers(token); setUsers(data); }
    catch (e) { console.log(e); } finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRole = async (id, role) => {
    try { await updateRole(id, role, token); alert("Role updated successfully"); loadUsers(); }
    catch (e) { console.log(e); alert("Failed to update role"); }
  };

  const handleDelete = async (user) => {
    if (user._id === currentUser?._id) { alert("You cannot delete your own account."); return; }
    if (!window.confirm(`Delete ${user.name}?`)) return;
    try { await deleteUser(user._id, token); alert("User deleted successfully"); loadUsers(); }
    catch (e) { console.log(e); alert("Failed to delete user"); }
  };

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>User Management</h1>
          <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>{loading ? "Loading…" : `${users.length} registered user${users.length !== 1 ? "s" : ""}`}</p>
        </div>

        {loading ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", color: "#4b6280", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "16px", height: "16px", border: "2px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Loading users…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : users.length === 0 ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#4b6280", margin: 0 }}>No users found.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {users.map(user => {
              const isSelf = user._id === currentUser?._id;
              const accent = ROLE_ACCENT[user.role] || "#4b6280";
              return (
                <div key={user._id} style={{ background: "rgba(15,22,38,0.85)", border: isSelf ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", transition: "border-color 0.2s" }}
                  onMouseEnter={e => { if (!isSelf) e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                  onMouseLeave={e => { if (!isSelf) e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `linear-gradient(135deg,${accent}88,${accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "#080d1a", flexShrink: 0 }}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "3px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 600, color: "#e2e8f0" }}>{user.name}</span>
                        {isSelf && <span style={{ padding: "2px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}>You</span>}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "#4b6280" }}>{user.email}</div>
                    </div>
                    <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", background: `${accent}20`, color: accent, border: `1px solid ${accent}35` }}>{user.role}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <select value={user.role} onChange={e => handleRole(user._id, e.target.value)}
                      style={{ padding: "9px 12px", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "9px", color: "white", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", outline: "none", cursor: "pointer" }}>
                      <option value="admin">Admin</option>
                      <option value="photographer">Photographer</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button onClick={() => handleDelete(user)} disabled={isSelf}
                      style={{ background: isSelf ? "rgba(100,116,139,0.1)" : "rgba(248,113,113,0.12)", color: isSelf ? "#475569" : "#f87171", border: `1px solid ${isSelf ? "rgba(100,116,139,0.2)" : "rgba(248,113,113,0.25)"}`, padding: "9px 16px", borderRadius: "9px", cursor: isSelf ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}