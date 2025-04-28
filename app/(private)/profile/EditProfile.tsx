"use client";

import { useUserStore } from "@/store/userStore";
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import apiClient from "lib/api-client";

export default function EditProfile() {
  const { user, setUser } = useUserStore();

  const form = useForm({
    initialValues: {
      email_address: user?.email_address || "",
      username: user?.username || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
    },
    validate: {
      email_address: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
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
    username: string;
    first_name: string;
    last_name: string;
  }) => {
    try {
      const response = await apiClient.put("/profile", values);
      setUser(response.data);
      notifications.show({
        title: "Success",
        message: "Profile updated successfully",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.detail || "Failed to update profile",
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email_address")}
        />
        <TextInput
          label="Username"
          placeholder="Your username"
          {...form.getInputProps("username")}
        />
        <TextInput
          label="First Name"
          placeholder="John"
          {...form.getInputProps("first_name")}
        />
        <TextInput
          label="Last Name"
          placeholder="Smith"
          {...form.getInputProps("last_name")}
        />
        <Button type="submit">Save Changes</Button>
      </Stack>
    </form>
  );
}
