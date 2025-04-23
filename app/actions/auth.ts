"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Logs the user out by clearing auth-related cookies and redirecting to login page
 */
export async function logout() {
  // Clear authentication cookies
  const cookieStore = cookies();
  cookieStore.delete("access_token");

  // Redirect to login page
  redirect("/auth/login");
}
