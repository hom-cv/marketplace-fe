"use client";

import BankSelect from "@/components/BankSelect";
import { BANKS } from "@/constants/banks";
import { useUserStore } from "@/store/userStore";
import {
  Button,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconBuildingBank,
  IconCircleCheck,
  IconClockHour4,
  IconCreditCard,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { submitVerification, type SellerVerificationForm } from "./actions";

export default function SellerVerification() {
  const { user } = useUserStore();
  const [status, setStatus] = useState<
    "form" | "submitting" | "pending" | "verified"
  >("form");

  useEffect(() => {
    if (user?.recipient) {
      if (user.recipient.verified) {
        setStatus("verified");
      } else {
        setStatus("pending");
      }
    }
  }, [user]);

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
    setStatus("submitting");
    try {
      const result = await submitVerification(values);

      if (result.error) {
        notifications.show({
          title: "Error",
          message: result.error.detail,
          color: "red",
        });
        setStatus("form");
        return;
      }

      notifications.show({
        title: "Success",
        message: "Seller verification submitted successfully",
        color: "green",
      });
      setStatus("pending");
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: "Failed to submit seller verification",
        color: "red",
      });
      setStatus("form");
    }
  };

  // Loader state
  if (status === "submitting") {
    return (
      <Stack align="center" gap="xl" py="xl">
        <Loader size="lg" />
        <Text size="sm" c="dimmed">
          Submitting your verification...
        </Text>
      </Stack>
    );
  }

  // Verified state
  if (status === "verified" && user && user.recipient) {
    const bankName =
      BANKS.find((bank) => bank.code === user.recipient?.bank_account_bank_code)
        ?.name || "Unknown Bank";

    return (
      <Stack align="center" gap="xl" py="xl">
        <ThemeIcon size={56} radius={100} variant="light">
          <IconCircleCheck size={32} />
        </ThemeIcon>
        <Stack gap="lg" w="100%" maw={400}>
          <Text size="sm" c="dimmed" ta="center" fw={500}>
            Verified Account Details
          </Text>
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon size="md" variant="light">
                <IconBuildingBank size={14} />
              </ThemeIcon>
              <Text fw={500} size="sm">
                {bankName}
              </Text>
            </Group>
            <Group gap="sm">
              <ThemeIcon size="md" variant="light">
                <IconCreditCard size={14} />
              </ThemeIcon>
              <Text size="sm" fw={500}>
                ****{user.recipient?.bank_account_last_digits}
              </Text>
            </Group>
            <Group gap="sm">
              <ThemeIcon size="md" variant="light">
                <IconUser size={14} />
              </ThemeIcon>
              <Text size="sm" fw={500}>
                {user.first_name} {user.last_name}
              </Text>
            </Group>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  // Pending state
  if (status === "pending" && user) {
    return (
      <Stack align="center" gap="xl" py="xl">
        <ThemeIcon size={56} radius={100} variant="light">
          <IconClockHour4 size={32} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" ta="center" maw={400}>
          Your account is being verified. We'll notify you once the verification
          is complete.
        </Text>
      </Stack>
    );
  }

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
