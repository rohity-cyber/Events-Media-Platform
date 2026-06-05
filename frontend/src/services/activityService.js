import API from "./api";

export const getActivities =
async(token)=>{

  const res =
  await API.get(
    "/activities",
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;

};