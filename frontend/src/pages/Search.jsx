import { useState } from "react";
import { searchEvents, searchTags, searchDate, searchUser } from "../services/searchService";
import Layout from "../components/Layout";

const TYPES = [
  { value: "events", label: "Event Name", icon: "◆" },
  { value: "tags",   label: "Tags",        icon: "#"  },
  { value: "date",   label: "Upload Date", icon: "⊡" },
  { value: "user",   label: "User Name",   icon: "◎" },
];

export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("events");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) { alert("Please enter a search term"); return; }
    setLoading(true); setSearched(true);
    try {
      const fns = { events: searchEvents, tags: searchTags, date: searchDate, user: searchUser };
      const data = await fns[type](keyword);
      setResults(data);
    } catch (e) { console.log(e); alert("Search failed"); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>Advanced Search</h1>
          <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>Search events, users, dates and tags</p>
        </div>

        <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "24px 26px", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {TYPES.map(t => (
              <button key={t.value} onClick={() => setType(t.value)}
                style={{ padding: "7px 16px", borderRadius: "8px", border: type === t.value ? "1px solid rgba(245,158,11,0.4)" : "1px solid rgba(255,255,255,0.08)", background: type === t.value ? "rgba(245,158,11,0.1)" : "transparent", color: type === t.value ? "#f59e0b" : "#64748b", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.15s" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <input value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder={`Search by ${TYPES.find(t => t.value === type)?.label?.toLowerCase()}…`}
              style={{ flex: 1, padding: "11px 14px", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "14px", fontFamily: "'DM Sans',sans-serif", outline: "none" }} />
            <button onClick={handleSearch} disabled={loading}
              style={{ background: loading ? "#334155" : "linear-gradient(135deg,#d97706,#f59e0b)", color: loading ? "#64748b" : "#080d1a", border: "none", padding: "11px 24px", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "14px", fontFamily: "'DM Sans',sans-serif", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" }}>
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
        </div>

        {searched && !loading && (
          <p style={{ fontSize: "12px", color: "#2d4057", marginBottom: "16px", letterSpacing: "0.05em" }}>
            {results.length} result{results.length !== 1 ? "s" : ""} for "{keyword}"
          </p>
        )}

        {loading ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px", color: "#4b6280", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "16px", height: "16px", border: "2px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Searching…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : searched && results.length === 0 ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", color: "#1e2d45" }}>⊙</div>
            <p style={{ color: "#4b6280", margin: 0 }}>No results found. Try a different keyword or search type.</p>
          </div>
        ) : !searched ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", color: "#1e2d45" }}>⊙</div>
            <p style={{ color: "#4b6280", margin: 0 }}>Search events, users, tags or upload dates above.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "14px" }}>
            {results.map(item => (
              <div key={item._id} style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                <h3 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: "16px", margin: "0 0 8px", color: "#f1f5f9" }}>{item.name || item.fileName || "Result"}</h3>
                {item.description && <p style={{ color: "#64748b", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}