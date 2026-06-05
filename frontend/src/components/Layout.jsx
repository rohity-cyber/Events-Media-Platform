import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useMobile from "../hooks/useMobile";

export default function Layout({ children }) {
  const mobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080d1a",
        color: "white",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 15% 10%, rgba(234,179,8,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 85% 85%, rgba(37,99,235,0.07) 0%, transparent 60%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Mobile hamburger button */}
      {mobile && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            position: "fixed",
            top: "18px",
            left: "16px",
            zIndex: 9999,
            background: "#0f172a",
            color: "white",
            border: "1px solid #334155",
            padding: "8px 12px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: 1,
          }}
        >
          ☰
        </button>
      )}

      {/* Mobile overlay backdrop */}
      {mobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9997,
          }}
        />
      )}

      {/* Sidebar */}
      {(!mobile || menuOpen) && (
        <div
          style={{
            position: mobile ? "fixed" : "sticky",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 9998,
            flexShrink: 0,
          }}
        >
          <Sidebar onNavigate={() => mobile && setMenuOpen(false)} />
        </div>
      )}

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Navbar mobile={mobile} />

        <main
          style={{
            padding: mobile ? "20px 16px" : "36px 40px",
            flex: 1,
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 10px; }
      `}</style>
    </div>
  );
}