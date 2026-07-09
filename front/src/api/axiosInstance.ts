import axios from "axios";
import { allEnv } from "../env";

let baseURL = allEnv("back") || "";
if (typeof window !== "undefined" && baseURL.includes("localhost")) {
  const currentHostname = window.location.hostname;
  if (currentHostname && currentHostname !== "localhost") {
    baseURL = baseURL.replace("localhost", currentHostname);
  }
}

function isTokenExpired(token: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      if (isTokenExpired(token)) {
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } catch {}
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(new Error("JWT token is expired. Request aborted."));
      }
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore (e.g., SSR or private mode)
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const isLoginRequest = error.config && error.config.url && error.config.url.includes("/auth/login");
    const hasToken = typeof window !== "undefined" && !!localStorage.getItem("token");

    if (error.response && error.response.status === 401 && hasToken && !isLoginRequest) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {
        // ignore
      }
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
