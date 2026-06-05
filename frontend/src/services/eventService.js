import API from "./api";

export const getEvents =
async () => {
  const res =
  await API.get("/events");

  return res.data;
};

export const createEvent =
async (eventData, token) => {

  const res =
  await API.post(
    "/events",
    eventData,
    {
      headers:{
        Authorization:
        `Bearer ${token}`
      }
    }
  );

  return res.data;
};