import axios from "axios";
import { allEnv } from "../env";

const baseURL = allEnv("back");
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore (e.g., SSR or private mode)
  }
  return config;
});

export default axiosInstance;
