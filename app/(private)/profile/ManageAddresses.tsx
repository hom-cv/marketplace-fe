"use client";

import { Address } from "@/types/address";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "./actions";

export default function ManageAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      street: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
    validate: {
      street: (value) => (!value ? "Street address is required" : null),
      city: (value) => (!value ? "City is required" : null),
      state: (value) => (!value ? "State is required" : null),
      country: (value) => (!value ? "Country is required" : null),
      postal_code: (value) => (!value ? "Postal code is required" : null),
    },
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsFetching(true);
        const data = await getAddresses();
        setAddresses(data);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: "Failed to fetch addresses",
          color: "red",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleSubmit = async (values: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  }) => {
    try {
      setIsLoading(true);
      const newAddress = await createAddress(values);
      setAddresses([...addresses, newAddress]);
      setIsAddingNew(false);
      form.reset();

      notifications.show({
        title: "Success",
        message: "Address added successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to add address",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (addressId: number) => {
    try {
      setIsLoading(true);
      await deleteAddress(addressId);
      setAddresses(addresses.filter((addr) => addr.id !== addressId));

      notifications.show({
        title: "Success",
        message: "Address removed successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to remove address",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      setIsLoading(true);
      const updatedAddress = await setDefaultAddress(addressId);
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          is_default: addr.id === addressId,
        }))
      );

      notifications.show({
        title: "Success",
        message: "Default address updated",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update default address",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Stack align="center" py="xl">
        <Loader />
        <Text size="sm" c="dimmed">
          Loading addresses...
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {addresses.map((address) => (
        <Card key={address.id} withBorder shadow="sm">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Box>
                <Stack gap={4}>
                  <Text fw={500}>{address.street}</Text>
                  <Text size="sm" c="dimmed">
                    {address.city}, {address.state}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {address.country} {address.postal_code}
                  </Text>
                  {address.is_default && (
                    <Badge variant="light" w="fit-content" mt={4}>
                      Default Address
                    </Badge>
                  )}
                </Stack>
              </Box>
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => handleDelete(address.id)}
                disabled={address.is_default || isLoading}
                size="lg"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>

            {!address.is_default && (
              <Button
                variant="light"
                size="xs"
                onClick={() => handleSetDefault(address.id)}
                disabled={isLoading}
                fullWidth
              >
                Set as Default
              </Button>
            )}
          </Stack>
        </Card>
      ))}

      {isAddingNew ? (
        <Card withBorder shadow="sm">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                withAsterisk
                label="Street Address"
                placeholder="123 Main St"
                {...form.getInputProps("street")}
              />
              <Stack gap="xs">
                <TextInput
                  withAsterisk
                  label="City"
                  placeholder="City"
                  {...form.getInputProps("city")}
                />
                <TextInput
                  withAsterisk
                  label="State"
                  placeholder="State"
                  {...form.getInputProps("state")}
                />
              </Stack>
              <Stack gap="xs">
                <TextInput
                  withAsterisk
                  label="Country"
                  placeholder="Country"
                  {...form.getInputProps("country")}
                />
                <TextInput
                  withAsterisk
                  label="Postal Code"
                  placeholder="12345"
                  {...form.getInputProps("postal_code")}
                />
              </Stack>
              <Group justify="flex-end" gap="xs">
                <Button
                  variant="light"
                  onClick={() => {
                    setIsAddingNew(false);
                    form.reset();
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={isLoading}>
                  Save Address
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>
      ) : (
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setIsAddingNew(true)}
          disabled={isLoading}
          fullWidth
        >
          Add New Address
        </Button>
      )}
    </Stack>
  );
}
