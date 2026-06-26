// src/api.js
import axios from "axios";
import { getApiUrl } from "../utils/apiUrl";

const baseUrl = getApiUrl();
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // ✅ send cookies automatically
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
