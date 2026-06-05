import { useEffect, useState } from "react";
import { getFavourites } from "../services/profileService";
import Layout from "../components/Layout";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const token = localStorage.getItem("token"); const data = await getFavourites(token); setFavourites(data); }
      catch (e) { console.log(e); } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <Layout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "30px", margin: "0 0 6px", color: "#f1f5f9" }}>My Favourites</h1>
          <p style={{ color: "#4b6280", margin: 0, fontSize: "14px" }}>{loading ? "Loading…" : `${favourites.length} saved item${favourites.length !== 1 ? "s" : ""}`}</p>
        </div>

        {loading ? (
          <div style={{ color: "#4b6280", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "16px", height: "16px", border: "2px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Loading favourites…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : favourites.length === 0 ? (
          <div style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "56px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", color: "#1e2d45" }}>◇</div>
            <p style={{ color: "#4b6280", margin: 0 }}>You haven't added any favourites yet. Heart items in the gallery to save them here.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "16px" }}>
            {favourites.map(item => (
              <div key={item._id} style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", transition: "all 0.22s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow = ""; }}>
                {item.mediaType === "image" && (
                  <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                    <img src={item.filePath} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,13,26,0.6) 0%, transparent 50%)" }} />
                  </div>
                )}
                <div style={{ padding: "16px 20px" }}>
                  <h3 style={{ fontFamily: "'DM Serif Display',serif", fontWeight: 400, fontSize: "16px", margin: "0 0 8px", color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.fileName}</h3>
                  <div style={{ display: "flex", gap: "16px" }}>
                    {item.event?.name && <span style={{ fontSize: "12px", color: "#60a5fa" }}>⬡ {item.event.name}</span>}
                    {item.uploader?.name && <span style={{ fontSize: "12px", color: "#4b6280" }}>by {item.uploader.name}</span>}
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