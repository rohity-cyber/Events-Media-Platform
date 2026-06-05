import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "react-router-dom";

import {
  getMediaById
} from "../services/sharedMediaService";

export default function SharedMedia(){

  const { id } =
  useParams();

  const [media,setMedia] =
  useState(null);

  const [loading,setLoading] =
  useState(true);

  useEffect(()=>{

    const loadMedia =
    async()=>{

      try{

        const data =
        await getMediaById(id);

        setMedia(data);

      }catch(error){

        console.log(error);

      }finally{

        setLoading(false);

      }

    };

    loadMedia();

  },[id]);

  if(loading){

    return(

      <div
        style={{
          minHeight:"100vh",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          background:"#080d1a",
          color:"white"
        }}
      >
        Loading...
      </div>

    );

  }

  if(!media){

    return(

      <div
        style={{
          minHeight:"100vh",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          background:"#080d1a",
          color:"white"
        }}
      >
        Media not found
      </div>

    );

  }

  return(

    <div
      style={{
        minHeight:"100vh",
        background:"#080d1a",
        color:"white",
        padding:"40px"
      }}
    >

      <div
        style={{
          maxWidth:"1200px",
          margin:"0 auto",
          background:
          "rgba(15,22,38,0.9)",
          border:
          "1px solid rgba(255,255,255,0.08)",
          borderRadius:"20px",
          overflow:"hidden"
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
              maxHeight:"700px",
              objectFit:"contain",
              background:"#000"
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
              src={media.filePath}
            />
          </video>

        }

        <div
          style={{
            padding:"25px"
          }}
        >

          <h1>
            {media.fileName}
          </h1>

          <p>
            Event:
            {" "}
            {
              media.event?.name
            }
          </p>

          <p>
            Uploaded By:
            {" "}
            {
              media.uploader?.name
            }
          </p>

          <p>
            Likes:
            {" "}
            {
              media.likes?.length
              || 0
            }
          </p>

          <a
            href={`${import.meta.env.VITE_API_URL}/download/${media._id}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display:"inline-block",
              marginTop:"20px",
              background:"#16a34a",
              color:"white",
              textDecoration:"none",
              padding:"12px 18px",
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