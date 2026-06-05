import API from "./api";

export const getUsers =
async(token)=>{

  const res =
  await API.get(
    "/admin/users",
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;

};

export const updateRole =
async(
  id,
  role,
  token
)=>{

  const res =
  await API.patch(

    `/admin/users/${id}/role`,

    { role },

    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }

  );

  return res.data;

};

export const deleteUser =
async(
  id,
  token
)=>{

  const res =
  await API.delete(

    `/admin/users/${id}`,

    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }

  );

  return res.data;

};