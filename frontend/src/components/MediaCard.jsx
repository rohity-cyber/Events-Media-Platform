export default function MediaCard({ item }) {
  return (
    <div
      style={{ background: "rgba(15,22,38,0.85)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden", transition: "transform 0.22s ease, box-shadow 0.22s ease", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Media */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {item.mediaType === "image" ? (
          <img src={item.filePath} alt={item.fileName}
            style={{ width: "100%", height: "220px", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
        ) : (
          <video controls style={{ width: "100%", display: "block", background: "#080d1a", maxHeight: "220px" }}>
            <source src={item.filePath} />
          </video>
        )}
        {/* Type badge */}
        <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(8,13,26,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "3px 10px", fontSize: "10px", fontWeight: 600, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {item.mediaType}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "15px 18px" }}>
        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.01em" }}>
          {item.fileName}
        </h3>
      </div>
    </div>
  );
}