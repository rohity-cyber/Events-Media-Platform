import API from "./api";

export const searchEvents =
async(keyword)=>{

  const res =
  await API.get(
    `/search/events?keyword=${keyword}`
  );

  return res.data;
};

export const searchTags =
async(keyword)=>{

  const res =
  await API.get(
    `/search/tags?keyword=${keyword}`
  );

  return res.data;
};

export const searchDate =
async(date)=>{

  const res =
  await API.get(
    `/search/date?date=${date}`
  );

  return res.data;
};

export const searchUser =
async(username)=>{

  const res =
  await API.get(
    `/search/user?username=${username}`
  );

  return res.data;
};