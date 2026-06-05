import { useEffect, useState } from "react";
import { uploadMedia } from "../services/mediaService";
import { getEvents } from "../services/eventService";
import Layout from "../components/Layout";

export default function MediaUpload() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingEvents(true);
        const data = await getEvents();
        setEvents(data);
        if (data.length > 0) setEventId(data[0]._id);
      } catch (e) { console.log(e); } finally { setLoadingEvents(false); }
    };
    load();
  }, []);

  const handleFiles = (selected) => {
    const arr = Array.from(selected);
    setFiles(arr);
    setPreviews(arr.map(f => ({ url: URL.createObjectURL(f), type: f.type })));
  };

  const handleUpload = async () => {
    if (files.length === 0) { alert("Please select at least one file"); return; }
    if (!eventId) { alert("Please create an event first"); return; }
    try {
      setUploading(true);
      const fd = new FormData();
      files.forEach(f => fd.append("media", f));
      fd.append("eventId", eventId);
      fd.append("visibility", "public");
      await uploadMedia(fd, localStorage.getItem("token"));
      alert(`${files.length} file(s) uploaded successfully`);
      setFiles([]); setPreviews([]);
    } catch (e) { console.log(e); alert("Upload failed"); }
    finally { setUploading(false); }
  };

  const sField = { width: "100%", padding: "11px 14px", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none" };

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: "860px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>Upload Media</h1>
          <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>Upload images and videos to your event gallery</p>
        </div>

        {/* Event picker */}
        <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "22px 24px", marginBottom: "18px" }}>
          <label style={{ display: "block", fontSize: "11.5px", fontWeight: 600, color: "#4b6280", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "10px" }}>Select Event</label>
          {loadingEvents ? (
            <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>Loading events…</p>
          ) : events.length === 0 ? (
            <div style={{ background: "rgba(8,13,26,0.5)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "14px 16px", color: "#4b6280", fontSize: "13.5px" }}>
              No events available. Create an event first.
            </div>
          ) : (
            <select value={eventId} onChange={e => setEventId(e.target.value)} style={sField}>
              {events.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          )}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => document.getElementById("media-file-input").click()}
          style={{ border: `2px dashed ${dragging ? "rgba(245,158,11,0.6)" : "rgba(255,255,255,0.1)"}`, borderRadius: "18px", padding: "56px 40px", textAlign: "center", background: dragging ? "rgba(245,158,11,0.04)" : "rgba(8,13,26,0.35)", marginBottom: "18px", transition: "all 0.2s", cursor: "pointer" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px", color: dragging ? "#f59e0b" : "#1e2d45" }}>⊕</div>
          <h3 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: "20px", margin: "0 0 8px", color: dragging ? "#f59e0b" : "#64748b" }}>
            {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Drag & Drop Files"}
          </h3>
          <p style={{ color: "#2d4057", fontSize: "13px", margin: "0 0 20px" }}>Images and videos supported · Click to browse</p>
          <input id="media-file-input" type="file" multiple onChange={e => handleFiles(e.target.files)} style={{ display: "none" }} />
          <span style={{ display: "inline-block", padding: "8px 20px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#94a3b8", fontSize: "13px" }}>Browse files</span>
        </div>

        {/* Upload btn */}
        {files.length > 0 && (
          <button onClick={handleUpload} disabled={uploading}
            style={{ background: uploading ? "#334155" : "linear-gradient(135deg,#d97706,#f59e0b)", color: uploading ? "#64748b" : "#080d1a", border: "none", padding: "12px 28px", borderRadius: "10px", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "14px", fontFamily: "'DM Sans',sans-serif", marginBottom: "32px", opacity: uploading ? 0.7 : 1 }}>
            {uploading ? "Uploading…" : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
          </button>
        )}

        {/* Previews */}
        {previews.length > 0 && (
          <>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#2d4057", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>Preview</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "12px" }}>
              {previews.map((p, i) => (
                <div key={i} style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", aspectRatio: p.type.startsWith("image") ? "1" : "16/9" }}>
                  {p.type.startsWith("image")
                    ? <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    : <video controls style={{ width: "100%", display: "block", background: "#080d1a" }}><source src={p.url} /></video>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}