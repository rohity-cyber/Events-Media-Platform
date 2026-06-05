import API from "./api";

export const getAllMedia =
async(token)=>{

  const res =
  await API.get(
    "/moderation/media",
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;

};

export const hideMedia =
async(
  id,
  token
)=>{

  const res =
  await API.patch(

    `/moderation/media/${id}/hide`,

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

export const publishMedia =
async(
  id,
  token
)=>{

  const res =
  await API.patch(

    `/moderation/media/${id}/publish`,

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

export const deleteMedia =
async(
  id,
  token
)=>{

  const res =
  await API.delete(

    `/moderation/media/${id}`,

    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }

  );

  return res.data;

};