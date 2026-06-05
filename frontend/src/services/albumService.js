import API from "./api";

export const getAlbums =
async()=>{

  const res =
  await API.get(
    "/albums"
  );

  return res.data;
};