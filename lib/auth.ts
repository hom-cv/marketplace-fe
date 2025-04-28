import { type User } from "@/schemas/user";
import Cookies from "js-cookie";
import apiClient from "./api-client";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get("/auth/user");
    return response.data;
  } catch (error) {
    return null;
  }
}

export function getAuthToken(): string | undefined {
  return Cookies.get("auth_token");
}

export function setAuthToken(token: string): void {
  Cookies.set("auth_token", token);
}

export function removeAuthToken(): void {
  Cookies.remove("auth_token");
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
