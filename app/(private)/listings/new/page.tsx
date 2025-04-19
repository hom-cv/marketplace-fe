"use client";

import { createListing } from "@/(private)/listings/actions";
import {
  Box,
  Button,
  Center,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./ListingForm.module.css"; // optional styling file

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      price: 0,
      brand: "",
      size: "",
      condition: "",
      category: "",
    },

    validate: {
      title: (v) => (v.length < 3 ? "Title is too short" : null),
      price: (v) => (v <= 0 ? "Price must be greater than 0" : null),
      brand: (v) => (!v ? "Required" : null),
      size: (v) => (!v ? "Required" : null),
      condition: (v) => (!v ? "Required" : null),
      category: (v) => (!v ? "Required" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await createListing(values);

      if (response) {
        router.push("/app");
        notifications.show({
          title: "Listing created successfully",
          message: "Your listing has been posted!",
          color: "green",
        });
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || "Listing creation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center className={classes.form_container}>
      <Box className={classes.form_box}>
        <Text fw={700}>Create New Listing</Text>

        {errorMessage && (
          <Text color="red" size="sm" mb="sm">
            {errorMessage}
          </Text>
        )}

        <form
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
          className={classes.form}
        >
          <TextInput
            withAsterisk
            label="Title"
            placeholder="Nike Air Max 97"
            key={form.key("title")}
            {...form.getInputProps("title")}
          />

          <Textarea
            withAsterisk
            label="Description"
            placeholder="Details about the item..."
            autosize
            minRows={3}
            key={form.key("description")}
            {...form.getInputProps("description")}
          />

          <NumberInput
            withAsterisk
            label="Price (THB)"
            placeholder="e.g. 1500"
            min={1}
            key={form.key("price")}
            {...form.getInputProps("price")}
            hideControls
          />

          <TextInput
            withAsterisk
            label="Brand"
            placeholder="e.g. Nike, Supreme"
            key={form.key("brand")}
            {...form.getInputProps("brand")}
          />

          <TextInput
            withAsterisk
            label="Size"
            placeholder="e.g. M, L, 42"
            key={form.key("size")}
            {...form.getInputProps("size")}
          />

          <Select
            withAsterisk
            label="Condition"
            placeholder="Select condition"
            data={["New", "Like New", "Used - Good", "Used - Fair"]}
            key={form.key("condition")}
            {...form.getInputProps("condition")}
          />

          <Select
            withAsterisk
            label="Category"
            placeholder="Select category"
            data={["Shirt", "Pants", "Shoes", "Accessories", "Outerwear"]}
            key={form.key("category")}
            {...form.getInputProps("category")}
          />

          <Button type="submit" loading={loading} mt="md" fullWidth>
            {loading ? "Posting..." : "Post Listing"}
          </Button>
        </form>
      </Box>
    </Center>
  );
}
