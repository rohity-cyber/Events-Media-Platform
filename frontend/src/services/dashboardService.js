import API from "./api";

export const getStats =
async(token)=>{

  const res =
  await API.get(
    "/dashboard/stats",
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;

};