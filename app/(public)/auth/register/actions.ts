import { registerSchema, type RegisterData } from "@/schemas/user";
import apiClient from "lib/api-client";

export async function handleRegister(data: RegisterData) {
  try {
    const validatedData = registerSchema.parse(data);
    const response = await apiClient.post("/auth/register", validatedData);
    return response.data;
  } catch (error: any) {
    if (error.name === "ZodError") {
      throw new Error("Invalid registration data");
    }
    throw new Error(error.response?.data?.detail || "Registration failed");
  }
}
