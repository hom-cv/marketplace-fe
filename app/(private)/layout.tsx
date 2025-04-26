"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useUserStore } from "@/store/userStore";
import { Center, Loader } from "@mantine/core";
import { getCurrentUser } from "lib/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser();

        if (!fetchedUser || fetchedUser.status === "PENDING") {
          router.push("/auth/login");
          return;
        }

        setUser(fetchedUser);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    };

    fetchUser();
  }, [user, router, setUser]);

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
      }}
    >
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
