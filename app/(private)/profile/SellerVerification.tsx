"use client";

import BankSelect from "@/components/BankSelect";
import { useUserStore } from "@/store/userStore";
import { Button, Select, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { submitVerification, type SellerVerificationForm } from "./actions";

export default function SellerVerification() {
  const { user } = useUserStore();

  const form = useForm<SellerVerificationForm>({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      tax_id: "",
      bank_brand: "",
      bank_number: "",
      bank_branch: "",
      type: "individual",
    },
    validate: {
      first_name: (value) => (!value ? "First name is required" : null),
      last_name: (value) => (!value ? "Last name is required" : null),
      bank_brand: (value) => (!value ? "Bank name is required" : null),
      bank_number: (value) => (!value ? "Account number is required" : null),
      bank_branch: (value) => (!value ? "Branch is required" : null),
    },
  });

  const handleSubmit = async (values: SellerVerificationForm) => {
    try {
      const result = await submitVerification(values);

      if (result.error) {
        notifications.show({
          title: "Error",
          message: result.error,
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Success",
        message: "Seller verification submitted successfully",
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: "Failed to submit seller verification",
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <Text size="sm" c="dimmed" mb="md">
          The information provided will be used solely for seller verification
          purposes and to facilitate secure fund transfers. We are committed to
          protecting your data in accordance with our privacy policy and
          applicable regulations.
        </Text>
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
          label="Tax ID (Optional)"
          placeholder="Enter your tax ID"
          {...form.getInputProps("tax_id")}
        />

        <Select
          withAsterisk
          label="Account Type"
          placeholder="Select account type"
          data={[
            { value: "individual", label: "Individual" },
            { value: "corporation", label: "Corporation" },
          ]}
          {...form.getInputProps("type")}
        />

        <BankSelect
          withAsterisk
          label="Bank Name"
          placeholder="Select your bank"
          {...form.getInputProps("bank_brand")}
        />
        <TextInput
          withAsterisk
          label="Account Number"
          placeholder="Enter account number"
          {...form.getInputProps("bank_number")}
        />
        <TextInput
          withAsterisk
          label="Branch"
          placeholder="Enter branch"
          {...form.getInputProps("bank_branch")}
        />

        <Button type="submit">Submit Verification</Button>
      </Stack>
    </form>
  );
}
