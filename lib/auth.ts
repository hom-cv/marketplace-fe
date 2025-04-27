import Cookies from "js-cookie";
import apiClient from "./api-client";

interface User {
  id: string;
  username: string;
  email_address: string;
  first_name: string;
  last_name: string;
  status: string;
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get("/auth/user");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || error.message || "Failed to fetch user";
    throw new Error(message);
  }
}

export async function login(data: { username: string; password: string }) {
  try {
    const formBody = new URLSearchParams();
    formBody.append("grant_type", "password");
    formBody.append("username", data.username);
    formBody.append("password", data.password);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      body: formBody,
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.detail || "Login failed");
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
}

export async function logout() {
  try {
    Cookies.remove("access_token");
  } catch (error: any) {
    console.error("Error during logout:", error);
  }
}
