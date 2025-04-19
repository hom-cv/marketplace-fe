import apiClient from "lib/api-client";

interface RegisterData {
  email_address: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
}

export async function handleRegister(data: RegisterData) {
  try {
    const response = await apiClient.post("/auth/register", data);

    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || error.message || "Registration failed";
    throw new Error(message);
  }
}
