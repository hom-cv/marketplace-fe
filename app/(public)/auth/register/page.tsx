"use client";

import { Box, Button, Center, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { registerUser } from "app/api/auth/register/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./Register.module.css";

export default function RegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    mode: "uncontrolled",
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

  const handleSubmit = async (values: {
    email_address: string;
    password: string;
    username: string;
    first_name: string;
    last_name: string;
  }) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await registerUser(values);

      if (response) {
        router.push("/");
        notifications.show({
          title: "Registration Successful",
          message: "You have successfully registered!",
          color: "green",
        });
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center className={classes.login_container}>
      <Box className={classes.login_box}>
        <Text fw={700}>Register</Text>

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
            placeholder="Your@email.com"
            key={form.key("email_address")}
            {...form.getInputProps("email_address")}
          />
          <TextInput
            withAsterisk
            label="Username"
            placeholder="Your Username"
            key={form.key("username")}
            {...form.getInputProps("username")}
          />
          <TextInput
            withAsterisk
            label="First Name"
            placeholder="John"
            key={form.key("first_name")}
            {...form.getInputProps("first_name")}
          />
          <TextInput
            withAsterisk
            label="Last Name"
            placeholder="Smith"
            key={form.key("last_name")}
            {...form.getInputProps("last_name")}
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
            {loading ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      </Box>
    </Center>
  );
}
