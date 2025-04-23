"use client";

import { Box, Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./Login.module.css";
import { handleLogin } from "./actions";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password: (value) =>
        value.length < 1 ? "Please enter your password" : null,
    },
  });

  const onSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await handleLogin(values);

      if (result) {
        notifications.show({
          title: "Login Successful",
          message: "Welcome back!",
          color: "green",
        });
        router.push("/app");
        router.refresh(); // Refresh the page to update server components with new auth state
      } else {
        setErrorMessage(result.error || "Login failed");
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || "An unexpected error occurred. Please try again."
      );
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.login_box}>
      <Text fw={700}>Login</Text>

      {errorMessage && (
        <Text color="red" size="sm">
          {errorMessage}
        </Text>
      )}

      <form onSubmit={form.onSubmit(onSubmit)} className={classes.login_form}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("username")}
        />
        <TextInput
          withAsterisk
          label="Password"
          placeholder="Your password"
          type="password"
          {...form.getInputProps("password")}
        />

        <Button type="submit" loading={loading} disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </Box>
  );
}
