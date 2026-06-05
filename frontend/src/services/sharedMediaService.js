import API from "./api";

export const getMediaById =
async(id)=>{

  const res =
  await API.get(
    `/media/${id}`
  );

  return res.data;

};