// src/api.js
import axios from "axios";
const baseUrl=import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // ✅ send cookies automatically
});

export default api;
