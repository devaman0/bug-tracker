import axios from "axios";

// AUTOMATIC SWITCHING:
// 1. If deployed to Vercel, it uses VITE_API_URL.
// 2. If running on a laptop, it uses http://localhost:5000.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;