import API from "./api";

export const getComments =
async(mediaId)=>{

  const res =
  await API.get(
    `/comments/${mediaId}`
  );

  return res.data;

};

export const addComment =
async(
  mediaId,
  text,
  token
)=>{

  const res =
  await API.post(

    "/comments",

    {
      mediaId,
      text
    },

    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }

  );

  return res.data;

};