import { getCurrentUser } from "@/api/auth/login/actions";
import { ReactNode, useEffect } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log("Current User:", user);
      } catch (error) {
        console.error("Error fetching user:", error);
        // Handle the error (e.g., redirect to login page)
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Protected Layout</h1>
      {children}
    </div>
  );
}
