import { useEffect, useState } from "react";

import {
  getMedia,
  deleteMedia,
  toggleVisibility,
  toggleFavourite,
  getShareLink
} from "../services/mediaService";

import Layout from "../components/Layout";

import MediaModal
from "../components/MediaModal";

const btn =
(bg,color)=>({

  background:bg,
  color,
  border:"none",
  padding:"8px 14px",
  borderRadius:"8px",
  cursor:"pointer",
  fontSize:"12px",
  fontWeight:600,
  fontFamily:"'DM Sans',sans-serif",
  letterSpacing:"0.03em"

});

export default function Gallery(){

  const [media,setMedia] =
  useState([]);

  const [loading,setLoading] =
  useState(true);

  const [selectedMedia,
  setSelectedMedia] =
  useState(null);

  const user =
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  );

  const canManageMedia =

    user?.role === "admin"

    ||

    user?.role ===
    "photographer";

  const loadMedia =
  async()=>{

    try{

      setLoading(true);

      const data =
      await getMedia();

      setMedia(data);

    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };

  useEffect(()=>{

    loadMedia();

  },[]);

  const handleDelete =
  async(id)=>{

    const confirmed =
    window.confirm(
      "Delete this media permanently?"
    );

    if(!confirmed){

      return;

    }

    try{

      await deleteMedia(

        id,

        localStorage.getItem(
          "token"
        )

      );

      alert(
        "Media deleted"
      );

      loadMedia();

    }catch(error){

      console.log(error);

      alert(
        "Delete failed"
      );

    }

  };

  const handleVisibility =
  async(item)=>{

    try{

      const next =

      item.visibility ===
      "public"

      ?

      "private"

      :

      "public";

      await toggleVisibility(

        item._id,

        next,

        localStorage.getItem(
          "token"
        )

      );

      alert(
        `Media is now ${next}`
      );

      loadMedia();

    }catch(error){

      console.log(error);

      alert(
        "Visibility update failed"
      );

    }

  };

  const handleFavourite =
  async(id)=>{

    try{

      await toggleFavourite(

        id,

        localStorage.getItem(
          "token"
        )

      );

      alert(
        "Favourite updated"
      );

      loadMedia();

    }catch(error){

      console.log(error);

      alert(
        "Failed to update favourite"
      );

    }

  };

  const handleShare =
  async(id)=>{

    try{

      const data =
      await getShareLink(id);

      navigator.clipboard.writeText(
        data.shareLink
      );

      alert(
        "Share link copied"
      );

    }catch(error){

      console.log(error);

      alert(
        "Failed to generate share link"
      );

    }

  };

  return(

    <Layout>

      <div
        style={{
          fontFamily:
          "'DM Sans', sans-serif"
        }}
      >

        <div
          style={{
            marginBottom:"32px"
          }}
        >

          <h1
            style={{
              fontFamily:
              "'DM Serif Display', serif",
              fontWeight:400,
              fontSize:"30px",
              margin:"0 0 6px",
              color:"#f1f5f9"
            }}
          >
            Media Gallery
          </h1>

          <p
            style={{
              color:"#4b6280",
              margin:0,
              fontSize:"14px"
            }}
          >
            {
              loading

              ?

              "Loading…"

              :

              `${media.length} item${
                media.length !== 1
                ? "s"
                : ""
              }`
            }
          </p>

        </div>

        {

          loading

          ?

          <div
            style={{
              background:
              "rgba(15,22,38,0.85)",
              border:
              "1px solid rgba(255,255,255,0.07)",
              borderRadius:"16px",
              padding:"28px",
              color:"#4b6280"
            }}
          >
            Loading media...
          </div>

          :

          media.length === 0

          ?

          <div
            style={{
              background:
              "rgba(15,22,38,0.85)",
              border:
              "1px solid rgba(255,255,255,0.07)",
              borderRadius:"16px",
              padding:"56px",
              textAlign:"center"
            }}
          >

            <h3>
              No media uploaded yet
            </h3>

          </div>

          :

          <div
            style={{
              display:"grid",
              gridTemplateColumns:
              "repeat(auto-fill,minmax(280px,1fr))",
              gap:"18px"
            }}
          >

            {

              media.map(
                item=>(

                  <div
                    key={item._id}
                    style={{
                      background:
                      "rgba(15,22,38,0.85)",
                      border:
                      "1px solid rgba(255,255,255,0.07)",
                      borderRadius:"18px",
                      overflow:"hidden"
                    }}
                  >

                    <div
                      onClick={()=>
                        setSelectedMedia(
                          item
                        )
                      }
                      style={{
                        cursor:"pointer"
                      }}
                    >

                      {

                        item.mediaType ===
                        "image"

                        ?

                        <img
                          src={
                            item.filePath
                          }
                          alt=""
                          style={{
                            width:"100%",
                            height:"240px",
                            objectFit:"cover",
                            display:"block"
                          }}
                        />

                        :

                        <video
                          controls
                          style={{
                            width:"100%"
                          }}
                        >
                          <source
                            src={
                              item.filePath
                            }
                          />
                        </video>

                      }

                    </div>

                    <div
                      style={{
                        padding:"18px 20px"
                      }}
                    >

                      <h3
                        style={{
                          color:"#f1f5f9"
                        }}
                      >
                        {
                          item.fileName
                        }
                      </h3>

                      <div
                        style={{
                          marginBottom:"12px"
                        }}
                      >

                        <div>
                          Event:
                          {" "}
                          {
                            item.event?.name
                          }
                        </div>

                        <div>
                          By:
                          {" "}
                          {
                            item.uploader?.name
                          }
                        </div>

                        <div>
                          Likes:
                          {" "}
                          {
                            item.likes
                            ?.length
                            || 0
                          }
                        </div>

                      </div>

                      <div
                        style={{
                          display:"flex",
                          flexWrap:"wrap",
                          gap:"8px"
                        }}
                      >

                        <button
                          onClick={()=>handleFavourite(
                            item._id
                          )}
                          style={
                            btn(
                              "rgba(245,158,11,0.12)",
                              "#f59e0b"
                            )
                          }
                        >
                          ♥ Save
                        </button>

                        <button
                          onClick={()=>handleShare(
                            item._id
                          )}
                          style={
                            btn(
                              "rgba(96,165,250,0.12)",
                              "#60a5fa"
                            )
                          }
                        >
                          ⊕ Share
                        </button>

                        {

                          canManageMedia

                          &&

                          <>

                            <button
                              onClick={()=>
                                handleVisibility(
                                  item
                                )
                              }
                              style={
                                btn(
                                  "rgba(167,139,250,0.12)",
                                  "#a78bfa"
                                )
                              }
                            >
                              Visibility
                            </button>

                            <button
                              onClick={()=>
                                handleDelete(
                                  item._id
                                )
                              }
                              style={
                                btn(
                                  "rgba(248,113,113,0.12)",
                                  "#f87171"
                                )
                              }
                            >
                              Delete
                            </button>

                          </>

                        }

                        <a
                          href={`http://localhost:5000/api/download/${item._id}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            ...btn(
                              "rgba(52,211,153,0.12)",
                              "#34d399"
                            ),
                            textDecoration:
                            "none"
                          }}
                        >
                          Download
                        </a>

                      </div>

                    </div>

                  </div>

                )
              )

            }

          </div>

        }

      </div>

      <MediaModal
        media={selectedMedia}
        onClose={()=>
          setSelectedMedia(
            null
          )
        }
      />

    </Layout>

  );

}