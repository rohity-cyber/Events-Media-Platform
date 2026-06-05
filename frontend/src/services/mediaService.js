import API from "./api";

export const uploadMedia =
async(formData,token)=>{

  const res =
  await API.post(
    "/media/upload",
    formData,
    {
      headers:{
        Authorization:
        `Bearer ${token}`,
        "Content-Type":
        "multipart/form-data"
      }
    }
  );

  return res.data;
};

export const getMedia =
async()=>{

  const res =
  await API.get(
    "/media"
  );

  return res.data;
};

export const deleteMedia =
async(id,token)=>{

  const res =
  await API.delete(
    `/media/${id}`,
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;
};

export const toggleVisibility =
async(
  id,
  visibility,
  token
)=>{

  const res =
  await API.patch(
    `/media/${id}/visibility`,
    { visibility },
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;
};

export const toggleFavourite =
async(id,token)=>{

  const res =
  await API.post(
    `/favourites/${id}`,
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

export const getShareLink =
async(id)=>{

  const res =
  await API.get(
    `/share/${id}`
  );

  return res.data;
};