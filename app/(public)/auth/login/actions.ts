"use client";

export async function handleLogin(formData: {
  username: string;
  password: string;
}) {
  try {
    const formBody = new URLSearchParams();
    formBody.append("grant_type", "password");
    formBody.append("username", formData.username);
    formBody.append("password", formData.password);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
