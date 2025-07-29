"use client";

import { Box, Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
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
      <div>
        <h1 className={classes.title}>Create an account</h1>
        <p className={classes.subtitle}>
          Join our community and start exploring unique fashion pieces
        </p>
      </div>

      <form
        onSubmit={form.onSubmit(onSubmit)}
        className={classes.register_form}
      >
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
            {...form.getInputProps("email_address")}
          />
        </div>

        <div>
          <TextInput
            label="Username"
            placeholder="Choose a username"
            classNames={{
              input: classes.input,
              label: classes.label,
            }}
            {...form.getInputProps("username")}
          />
        </div>

        <div>
          <TextInput
            label="First Name"
            placeholder="Enter your first name"
            classNames={{
              input: classes.input,
              label: classes.label,
            }}
            {...form.getInputProps("first_name")}
          />
        </div>

        <div>
          <TextInput
            label="Last Name"
            placeholder="Enter your last name"
            classNames={{
              input: classes.input,
              label: classes.label,
            }}
            {...form.getInputProps("last_name")}
          />
        </div>

        <div>
          <TextInput
            label="Password"
            type="password"
            placeholder="Create a password"
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
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className={classes.login_text}>
        Already have an account?{" "}
        <Link href="/auth/login" className={classes.login_link}>
          Sign in
        </Link>
      </p>
    </Box>
  );
}
