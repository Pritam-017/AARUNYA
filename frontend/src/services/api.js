import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (college) => API.post("/auth/login", { college });
export const submitCheckin = (data) => API.post("/checkin", data);
export const getCheckinHistory = () => API.get("/checkin/history");
export const getBurnoutScore = () => API.get("/burnout/score");
export const getCopingSuggestion = () => API.get("/burnout/suggestion");
export const getOrCreateRoom = (college) => API.post("/chat/room", { college });
export const getChatMessages = (roomId) => API.get(`/chat/messages/${roomId}`);
export const sendMessage = (roomId, text, username) => API.post("/chat/message", { roomId, text, username });

export default API;
