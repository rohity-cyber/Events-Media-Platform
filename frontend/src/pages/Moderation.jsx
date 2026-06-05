import { useEffect, useState } from "react";
import { getAllMedia, hideMedia, publishMedia, deleteMedia } from "../services/moderationService";
import Layout from "../components/Layout";

export default function Moderation() {
  const [media, setMedia] = useState([]);
  const token = localStorage.getItem("token");

  const loadMedia = async () => {
    try { const data = await getAllMedia(token); setMedia(data); } catch (e) { console.log(e); }
  };

  useEffect(() => { loadMedia(); }, []);

  const handleHide    = async (id) => { await hideMedia(id, token);    loadMedia(); };
  const handlePublish = async (id) => { await publishMedia(id, token); loadMedia(); };
  const handleDelete  = async (id) => { await deleteMedia(id, token);  loadMedia(); };

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>Media Moderation</h1>
          <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>{media.length} item{media.length !== 1 ? "s" : ""} under review</p>
        </div>

        {media.length === 0 && (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", color: "#1e2d45" }}>⊘</div>
            <p style={{ color: "#4b6280", margin: 0 }}>No media to moderate.</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {media.map(item => {
            const isPublic = item.visibility === "public";
            return (
              <div key={item._id} style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(8,13,26,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#2d4057", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {item.mediaType === "image" ? "▣" : "▶"}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0", marginBottom: "5px" }}>{item.fileName}</div>
                    <span style={{ padding: "2px 9px", borderRadius: "5px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", background: isPublic ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)", color: isPublic ? "#34d399" : "#f87171", border: `1px solid ${isPublic ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}` }}>
                      {item.visibility}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleHide(item._id)} style={{ background: "rgba(251,146,60,0.12)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.25)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>Hide</button>
                  <button onClick={() => handlePublish(item._id)} style={{ background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>Publish</button>
                  <button onClick={() => handleDelete(item._id)} style={{ background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.25)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}