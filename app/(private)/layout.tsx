"use client";

import { getCurrentUser } from "@/api/auth/login/actions";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log("Current User:", user);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    };
    fetchUser();
  }, []);

  return <div>{children}</div>;
}
