import axios from "axios";
import { getCookie, removeCookie } from "./util/cookies";

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

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear the access token
      removeCookie("access_token");

      // Redirect to login page
      if (typeof window !== "undefined") {
        // Store the current path to redirect back after login
        const currentPath = window.location.pathname;
        if (currentPath !== "/auth/login") {
          window.location.href = `/auth/login?redirect=${encodeURIComponent(
            currentPath
          )}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
