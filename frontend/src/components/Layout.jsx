import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {

  const [mobile,setMobile] =
  useState(
    window.innerWidth < 768
  );

  const [menuOpen,setMenuOpen] =
  useState(false);

  useEffect(()=>{

    const handleResize = ()=>{

      setMobile(
        window.innerWidth < 768
      );

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return ()=>{

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  },[]);

  return(

    <div
      style={{
        minHeight:"100vh",
        background:"#080d1a",
        color:"white",
        fontFamily:
        "'DM Sans', sans-serif"
      }}
    >

      <div
        style={{
          position:"fixed",
          inset:0,
          background:
          `radial-gradient(
            ellipse 80% 60%
            at 15% 10%,
            rgba(234,179,8,0.06) 0%,
            transparent 60%
          ),
          radial-gradient(
            ellipse 60% 50%
            at 85% 85%,
            rgba(37,99,235,0.07) 0%,
            transparent 60%
          )`,
          pointerEvents:"none",
          zIndex:0
        }}
      />

      {mobile && (

        <button
          onClick={()=>
            setMenuOpen(
              !menuOpen
            )
          }
          style={{
            position:"fixed",
            top:"15px",
            left:"15px",
            zIndex:9999,
            background:"#0f172a",
            color:"white",
            border:"1px solid #334155",
            padding:"10px 14px",
            borderRadius:"10px",
            cursor:"pointer"
          }}
        >
          ☰
        </button>

      )}

      {(!mobile || menuOpen) && (

        <div
          style={{
            position:
            mobile
            ? "fixed"
            : "relative",
            zIndex:9998,
            height:"100%"
          }}
        >
          <Sidebar />
        </div>

      )}

      <div
        style={{
          marginLeft:
          mobile
          ? 0
          : "260px",
          minHeight:"100vh",
          position:"relative",
          zIndex:1
        }}
      >

        <Navbar />

        <main
          style={{
            padding:
            mobile
            ? "20px"
            : "36px 40px"
          }}
        >
          {children}
        </main>

      </div>

      <style>{`

        @import url(
          'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap'
        );

        *{
          box-sizing:border-box;
        }

        ::-webkit-scrollbar{
          width:5px;
        }

        ::-webkit-scrollbar-thumb{
          background:#1e2d45;
          border-radius:10px;
        }

      `}</style>

    </div>

  );

}