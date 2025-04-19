"use client";

import { Box, Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./Register.module.css";
import { handleRegister } from "./actions";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    initialValues: {
      email_address: "",
      password: "",
      username: "",
      first_name: "",
      last_name: "",
    },
    validate: {
      email_address: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      username: (value) =>
        value.length < 1 ? "Please enter your username" : null,
      first_name: (value) =>
        value.length < 1 ? "Please enter your first name" : null,
      last_name: (value) =>
        value.length < 1 ? "Please enter your last name" : null,
    },
  });

  const onSubmit = async (values: {
    email_address: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
  }) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await handleRegister(values);

      if (result) {
        notifications.show({
          title: "Registration Successful",
          message: "You have successfully registered! Please log in.",
          color: "green",
        });
        router.push("/auth/login");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Registration failed");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.register_box}>
      <Text fw={700}>Register</Text>

      {errorMessage && (
        <Text color="red" size="sm">
          {errorMessage}
        </Text>
      )}

      <form
        onSubmit={form.onSubmit(onSubmit)}
        className={classes.register_form}
      >
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email_address")}
        />
        <TextInput
          withAsterisk
          label="Username"
          placeholder="Your username"
          {...form.getInputProps("username")}
        />
        <TextInput
          withAsterisk
          label="First Name"
          placeholder="John"
          {...form.getInputProps("first_name")}
        />
        <TextInput
          withAsterisk
          label="Last Name"
          placeholder="Smith"
          {...form.getInputProps("last_name")}
        />
        <TextInput
          withAsterisk
          label="Password"
          placeholder="Your password"
          type="password"
          {...form.getInputProps("password")}
        />

        <Button type="submit" loading={loading} disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </Button>
      </form>
    </Box>
  );
}
