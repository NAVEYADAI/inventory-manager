import axiosInstance from "./axiosInstance";

export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken?: string;
  user?: { id?: number; email?: string; name?: string };
};

export async function register(payload: RegisterPayload) {
  return axiosInstance.post("/auth/register", payload);
}

export async function login(payload: { userName: string; password: string }) {
  const res = await axiosInstance.post<LoginResponse>("/auth/login", payload);
  try {
    const token = res?.data?.accessToken;
    if (token) {
      localStorage.setItem("token", token);
    }
  } catch (e) {
    // ignore localStorage errors
  }
  return res;
}

export function logout() {
  try {
    localStorage.removeItem("token");
  } catch (e) {
    // ignore
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    return null;
  }
}
