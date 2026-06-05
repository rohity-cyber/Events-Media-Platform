import API from "./api";

export const toggleLike =
async(
  mediaId,
  token
)=>{

  const res =
  await API.post(

    `/likes/${mediaId}`,

    {},

    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }

  );

  return res.data;

};