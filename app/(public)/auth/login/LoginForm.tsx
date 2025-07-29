"use client";

import { Box, Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import classes from "./Login.module.css";
import { handleLogin } from "./actions";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
        // Manually set the cookie from the response
        if (result.access_token) {
          Cookies.set("access_token", result.access_token, {
            expires: 7, // 7 days
            path: "/",
            secure: window.location.protocol === "https:",
            sameSite: "Lax",
          });
        }

        notifications.show({
          title: "Login Successful",
          message: "Welcome back!",
          color: "green",
        });

        // Check for redirect parameter
        const redirect = searchParams.get("redirect");
        router.push(redirect || "/app");
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
      <div>
        <h1 className={classes.title}>Welcome back</h1>
        <p className={classes.subtitle}>
          Enter your email and password to access your account
        </p>
      </div>

      <form onSubmit={form.onSubmit(onSubmit)} className={classes.login_form}>
        {errorMessage && (
          <Text className={classes.error_message}>{errorMessage}</Text>
        )}

        <div>
          <TextInput
            label="Email address"
            placeholder="Enter your email"
            classNames={{
              input: classes.input,
              label: classes.label,
            }}
            {...form.getInputProps("username")}
          />
        </div>

        <div>
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            classNames={{
              input: classes.input,
              label: classes.label,
            }}
            {...form.getInputProps("password")}
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className={classes.submit_button}
          fullWidth
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className={classes.signup_text}>
        Don&#39;t have an account?{" "}
        <Link href="/auth/register" className={classes.signup_link}>
          Sign up
        </Link>
      </p>
    </Box>
  );
}
