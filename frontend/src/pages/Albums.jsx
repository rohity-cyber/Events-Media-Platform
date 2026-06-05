import { useEffect, useState } from "react";
import { getAlbums } from "../services/albumService";
import Layout from "../components/Layout";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const data = await getAlbums(); setAlbums(data); }
      catch (e) { console.log(e); } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>Albums</h1>
          <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>{loading ? "Loading…" : `${albums.length} collection${albums.length !== 1 ? "s" : ""}`}</p>
        </div>

        {loading ? (
          <div style={{ color: "#4b6280", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "16px", height: "16px", border: "2px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Loading albums…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : albums.length === 0 ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", color: "#1e2d45" }}>▤</div>
            <p style={{ color: "#4b6280", margin: 0 }}>No albums available yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
            {albums.map(album => (
              <div key={album._id} style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", transition: "all 0.22s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = ""; }}>
                {album.coverImage ? (
                  <div style={{ height: "175px", overflow: "hidden", position: "relative" }}>
                    <img src={album.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,13,26,0.7) 0%, transparent 60%)" }} />
                  </div>
                ) : (
                  <div style={{ height: "90px", background: "rgba(8,13,26,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#1e2d45" }}>▤</div>
                )}
                <div style={{ padding: "16px 20px" }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "17px", margin: "0 0 6px", color: "#f1f5f9" }}>{album.title}</h3>
                  <p style={{ color: "#4b6280", fontSize: "13px", margin: 0 }}>{album.event?.name ? `⬡ ${album.event.name}` : "No Event"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}