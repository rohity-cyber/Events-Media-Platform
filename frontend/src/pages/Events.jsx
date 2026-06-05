import { useEffect, useState } from "react";
import { getEvents, createEvent } from "../services/eventService";
import Layout from "../components/Layout";

const iStyle = { width: "100%", padding: "11px 14px", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" };
const lbl = { display: "block", fontSize: "11.5px", fontWeight: 600, color: "#4b6280", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "7px" };

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "" });

  const loadEvents = async () => {
    try { setLoading(true); const data = await getEvents(); setEvents(data); }
    catch (e) { console.log(e); } finally { setLoading(false); }
  };

  useEffect(() => { loadEvents(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) { alert("Please fill all fields"); return; }
    try {
      setCreating(true);
      const token = localStorage.getItem("token");
      await createEvent(form, token);
      alert("Event created successfully");
      setForm({ name: "", description: "", category: "" });
      setOpen(false);
      loadEvents();
    } catch (error) { alert(error.response?.data?.message || "Failed to create event"); }
    finally { setCreating(false); }
  };

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>Events</h1>
            <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>Total: {events.length}</p>
          </div>
          <button onClick={() => setOpen(o => !o)} style={{ background: open ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#d97706,#f59e0b)", color: open ? "#94a3b8" : "#080d1a", border: open ? "1px solid rgba(255,255,255,0.1)" : "none", padding: "11px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "13px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em" }}>
            {open ? "✕ Cancel" : "+ New Event"}
          </button>
        </div>

        {/* Create form */}
        {open && (
          <div style={{ background: "rgba(15,22,38,0.9)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "16px", padding: "26px 28px", marginBottom: "28px" }}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "18px", margin: "0 0 22px", color: "#f1f5f9" }}>New Event</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div><label style={lbl}>Event Name</label><input name="name" placeholder="Summer Gala 2025" value={form.name} onChange={handleChange} style={iStyle} /></div>
                <div><label style={lbl}>Category</label><input name="category" placeholder="Wedding, Conference…" value={form.category} onChange={handleChange} style={iStyle} /></div>
              </div>
              <div style={{ marginBottom: "22px" }}><label style={lbl}>Description</label><input name="description" placeholder="Brief description" value={form.description} onChange={handleChange} style={iStyle} /></div>
              <button type="submit" disabled={creating} style={{ background: "linear-gradient(135deg,#d97706,#f59e0b)", color: "#080d1a", border: "none", padding: "11px 26px", borderRadius: "10px", cursor: creating ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "13px", fontFamily: "'DM Sans', sans-serif", opacity: creating ? 0.7 : 1 }}>
                {creating ? "Creating…" : "Create Event"}
              </button>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", color: "#4b6280", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "16px", height: "16px", border: "2px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Loading events…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : events.length === 0 ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", color: "#1e2d45" }}>◆</div>
            <p style={{ color: "#4b6280", margin: 0 }}>No events yet. Create your first event above.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: "16px" }}>
            {events.map(event => (
              <div key={event._id} style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "22px", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = ""; }}>
                {event.category && <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", background: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)", marginBottom: "12px" }}>{event.category}</span>}
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "18px", margin: "0 0 8px", color: "#f1f5f9" }}>{event.name}</h3>
                <p style={{ color: "#64748b", fontSize: "13.5px", margin: "0 0 14px", lineHeight: 1.5 }}>{event.description}</p>
                {event.createdBy && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "linear-gradient(135deg,#d97706,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "#080d1a" }}>{event.createdBy.name?.charAt(0)?.toUpperCase()}</div>
                    <span style={{ fontSize: "12px", color: "#4b6280" }}>{event.createdBy.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}