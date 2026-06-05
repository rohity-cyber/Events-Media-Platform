import { useEffect, useState } from "react";

import {
  getComments,
  addComment
} from "../services/commentService";

import {
  toggleLike
} from "../services/likeService";

export default function MediaModal({

  media,
  onClose

}){

  const [comments,setComments] =
  useState([]);

  const [text,setText] =
  useState("");

  const [likes,setLikes] =
  useState(0);

  const token =
  localStorage.getItem(
    "token"
  );

  const loadComments =
  async()=>{

    try{

      const data =
      await getComments(
        media._id
      );

      setComments(data);

    }catch(error){

      console.log(error);

    }

  };

  useEffect(()=>{

    if(media){

      setLikes(
        media.likes?.length || 0
      );

      loadComments();

    }

  },[media]);

  const handleComment =
  async()=>{

    if(!text.trim()){

      return;

    }

    try{

      await addComment(

        media._id,
        text,
        token

      );

      setText("");

      loadComments();

    }catch(error){

      console.log(error);

    }

  };

  const handleLike =
  async()=>{

    try{

      const updated =
      await toggleLike(

        media._id,
        token

      );

      setLikes(
        updated.likes?.length || 0
      );

    }catch(error){

      console.log(error);

    }

  };

  if(!media){

    return null;

  }

  return(

    <div
      onClick={onClose}
      style={{
        position:"fixed",
        inset:0,
        background:
        "rgba(0,0,0,0.85)",
        zIndex:9999,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        padding:"30px"
      }}
    >

      <div
        onClick={(e)=>
          e.stopPropagation()
        }
        style={{
          width:"100%",
          maxWidth:"1200px",
          maxHeight:"90vh",
          overflow:"hidden",
          background:"#0f172a",
          border:
          "1px solid rgba(255,255,255,0.08)",
          borderRadius:"20px",
          display:"grid",
          gridTemplateColumns:
          "1.3fr 0.7fr"
        }}
      >

        <div
          style={{
            background:"#000"
          }}
        >

          {

            media.mediaType ===
            "image"

            ?

            <img
              src={media.filePath}
              alt=""
              style={{
                width:"100%",
                height:"100%",
                objectFit:"contain",
                maxHeight:"90vh"
              }}
            />

            :

            <video
              controls
              style={{
                width:"100%",
                height:"100%"
              }}
            >
              <source
                src={media.filePath}
              />
            </video>

          }

        </div>

        <div
          style={{
            display:"flex",
            flexDirection:"column",
            padding:"24px",
            overflowY:"auto"
          }}
        >

          <div
            style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              marginBottom:"15px"
            }}
          >

            <h2
              style={{
                margin:0
              }}
            >
              {media.fileName}
            </h2>

            <button
              onClick={onClose}
              style={{
                background:"transparent",
                color:"#94a3b8",
                border:"none",
                cursor:"pointer",
                fontSize:"20px"
              }}
            >
              ✕
            </button>

          </div>

          <p>
            <strong>Event:</strong>
            {" "}
            {media.event?.name}
          </p>

          <p>
            <strong>Uploaded By:</strong>
            {" "}
            {media.uploader?.name}
          </p>

          <div
            style={{
              display:"flex",
              gap:"10px",
              marginBottom:"20px"
            }}
          >

            <button
              onClick={handleLike}
              style={{
                background:"#2563eb",
                color:"white",
                border:"none",
                padding:"10px 14px",
                borderRadius:"10px",
                cursor:"pointer"
              }}
            >
              👍 Like
            </button>

            <div
              style={{
                display:"flex",
                alignItems:"center",
                color:"#94a3b8"
              }}
            >
              {likes} Likes
            </div>

          </div>

          <hr
            style={{
              borderColor:"#1e293b"
            }}
          />

          <h3>
            Comments
          </h3>

          <div
            style={{
              flex:1,
              overflowY:"auto",
              marginBottom:"20px"
            }}
          >

            {

              comments.map(
                comment=>(

                  <div
                    key={comment._id}
                    style={{
                      marginBottom:"14px",
                      paddingBottom:"10px",
                      borderBottom:
                      "1px solid #1e293b"
                    }}
                  >

                    <strong>
                      {
                        comment.user?.name
                      }
                    </strong>

                    <p>
                      {
                        comment.text
                      }
                    </p>

                  </div>

                )
              )

            }

          </div>

          <textarea
            value={text}
            onChange={(e)=>
              setText(
                e.target.value
              )
            }
            placeholder=
            "Write a comment..."
            style={{
              width:"100%",
              minHeight:"90px",
              borderRadius:"10px",
              padding:"12px",
              background:"#111827",
              color:"white",
              border:
              "1px solid #334155"
            }}
          />

          <button
            onClick={
              handleComment
            }
            style={{
              marginTop:"10px",
              width:"100%",
              background:"#2563eb",
              border:"none",
              color:"white",
              padding:"12px",
              borderRadius:"10px",
              cursor:"pointer"
            }}
          >
            Add Comment
          </button>

          <a
            href={`${import.meta.env.VITE_API_URL}/download/${media._id}`}
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop:"12px",
              textAlign:"center",
              background:"#16a34a",
              color:"white",
              textDecoration:"none",
              padding:"12px",
              borderRadius:"10px"
            }}
          >
            Download Media
          </a>

        </div>

      </div>

    </div>

  );

}