import axiosInstance from "../../authenticated_client";

export async function loginUser(data: { username: string; password: string }) {
  try {
    const formBody = new URLSearchParams();
    formBody.append("grant_type", "password");
    formBody.append("username", data.username);
    formBody.append("password", data.password);

    const res = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      body: formBody,
      credentials: "include", // Make sure cookies are sent with the request
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

export async function getCurrentUser() {
  try {
    const response = await axiosInstance.get("/auth/user");

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || error.message || "Something went wrong";
    throw new Error(message);
  }
}
