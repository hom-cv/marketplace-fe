import axios from "axios";
import Cookies from "js-cookie";

// Utility to read a cookie by name - first try js-cookie, then fallback to document.cookie
function getCookie(name: string): string | null {
  // Try to get cookie using js-cookie first (more reliable)
  const jsCookie = Cookies.get(name);
  if (jsCookie) return jsCookie;

  // Fallback to document.cookie parsing
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
