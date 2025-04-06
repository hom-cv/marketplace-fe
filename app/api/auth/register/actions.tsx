export async function registerUser(data: {
  email_address: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
}) {
  try {
    const res = await fetch("http://localhost:8000/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.detail || "Registration failed");
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
}
