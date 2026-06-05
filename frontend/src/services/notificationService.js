import API from "./api";

export const getNotifications =
async(token)=>{

  const res =
  await API.get(
    "/notifications",
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;
};