import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("hostelos_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    const rawUser = localStorage.getItem("hostelos_user");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      config.headers["X-User-Role"] = user.role || user.userType || "admin";
    }
  }
  return config;
});

export function persistSession(session) {
  localStorage.setItem("hostelos_token", session.token);
  localStorage.setItem("hostelos_user", JSON.stringify(session.user));
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("hostelos_user");
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem("hostelos_token");
  localStorage.removeItem("hostelos_user");
}
