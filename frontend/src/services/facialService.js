import API from "./api";

export const uploadSelfie =
async(formData,token)=>{

  const res =
  await API.post(
    "/facial/selfie",
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

export const getMyPhotos =
async(token)=>{

  const res =
  await API.get(
    "/facial/my-photos",
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;
};