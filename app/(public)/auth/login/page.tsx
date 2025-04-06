"use client";

import { Box, Button, Center, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { loginUser } from "app/api/auth/login/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./Login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    mode: "uncontrolled",
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

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await loginUser(values);

      if (response) {
        router.push("/");
        notifications.show({
          title: "Login Successful",
          message: "Welcome back!",
          color: "green",
        });
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center className={classes.login_container}>
      <Box className={classes.login_box}>
        <Text fw={700}>Login</Text>

        {errorMessage && (
          <Text color="red" size="sm">
            {errorMessage}
          </Text>
        )}

        <form
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
          className={classes.login_form}
        >
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            key={form.key("username")}
            {...form.getInputProps("username")}
          />
          <TextInput
            withAsterisk
            label="Password"
            placeholder="Your password"
            type="password"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />

          <Button type="submit" loading={loading} disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Box>
    </Center>
  );
}
