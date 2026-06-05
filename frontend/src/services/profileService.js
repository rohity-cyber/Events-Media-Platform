import API from "./api";

export const getProfile =
async(token)=>{

  const res =
  await API.get(
    "/users/profile",
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;
};

export const getFavourites =
async(token)=>{

  const res =
  await API.get(
    "/users/favourites",
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;
};