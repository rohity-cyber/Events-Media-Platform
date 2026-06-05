import axios from "axios";

const API = axios.create({
  baseURL: "https://events-media-platform-backend.onrender.com/"
});

export default API;