import { useState, useEffect } from "react";
import { uploadSelfie, getMyPhotos } from "../services/facialService";
import Layout from "../components/Layout";

export default function MyPhotos() {
  const [file, setFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem("token");

  const loadPhotos = async () => {
    try { const data = await getMyPhotos(token); setPhotos(data.matches || []); } catch (e) { console.log(e); }
  };

  useEffect(() => { loadPhotos(); }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) { alert("Please select a selfie"); return; }
    setLoading(true);
    try {
      const fd = new FormData(); fd.append("selfie", file);
      await uploadSelfie(fd, token);
      await loadPhotos();
      alert("Face search completed");
    } catch (e) { console.log(e); alert("Face search failed"); }
    finally { setLoading(false); }
  };

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>My Photos</h1>
          <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>Upload a selfie to find photos of you across all events</p>
        </div>

        {/* Selfie panel */}
        <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "26px 28px", marginBottom: "32px", display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
          <div onClick={() => document.getElementById("selfie-input").click()}
            style={{ width: "88px", height: "88px", borderRadius: "50%", overflow: "hidden", border: "2px dashed rgba(245,158,11,0.35)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, background: "rgba(8,13,26,0.5)", transition: "border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.65)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.35)"}>
            {preview ? <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "22px", color: "#2d4057" }}>◎</span>}
          </div>
          <input id="selfie-input" type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: "18px", margin: "0 0 6px", color: "#f1f5f9" }}>Upload your selfie</h3>
            <p style={{ color: "#4b6280", fontSize: "13px", margin: "0 0 16px" }}>We'll scan all event photos to find you</p>
            <button onClick={handleUpload} disabled={loading}
              style={{ background: loading ? "#334155" : "linear-gradient(135deg,#d97706,#f59e0b)", color: loading ? "#64748b" : "#080d1a", border: "none", padding: "10px 22px", borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "13px", fontFamily: "'DM Sans',sans-serif", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Scanning…" : "Find My Photos"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#2d4057", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>Matched Photos ({photos.length})</p>
        </div>

        {photos.length === 0 ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", color: "#1e2d45" }}>▣</div>
            <p style={{ color: "#4b6280", margin: 0 }}>No matching photos found. Try uploading a clearer selfie.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "16px" }}>
            {photos.map(photo => (
              <div key={photo._id} style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                {photo.mediaType === "image" && <img src={photo.filePath} alt="" style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }} />}
                <div style={{ padding: "16px 20px" }}>
                  <h3 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: "15px", margin: "0 0 8px", color: "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{photo.fileName}</h3>
                  <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", color: "#60a5fa" }}>⬡ {photo.event?.name || "Unknown"}</span>
                    <span style={{ fontSize: "12px", color: "#4b6280" }}>by {photo.uploader?.name || "Unknown"}</span>
                    <span style={{ fontSize: "12px", color: "#4b6280" }}>♥ {photo.likes?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}