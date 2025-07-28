"use client";

import { Address } from "@/schemas/address";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
} from "app/(private)/profile/actions";
import { useEffect, useState } from "react";

interface AddressSelectorProps {
  mode: "select" | "manage";
  selectedAddress?: Address | null;
  onAddressSelect?: (address: Address | null) => void;
  onAddressChange?: (addresses: Address[]) => void;
  showContactInfo?: boolean;
  contactInfo?: {
    fullName: string;
    phone: string;
  };
  onContactInfoChange?: (field: "fullName" | "phone", value: string) => void;
}

export default function AddressSelector({
  mode,
  selectedAddress,
  onAddressSelect,
  onAddressChange,
  showContactInfo = false,
  contactInfo,
  onContactInfoChange,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm({
    initialValues: {
      street: "",
      city: "",
      state: "",
      country: "Thailand",
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
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsFetching(true);
      const data = await getAddresses();
      setAddresses(data);

      // Auto-select default address in select mode
      if (mode === "select" && !selectedAddress) {
        const defaultAddress = data.find((addr) => addr.is_default);
        if (defaultAddress && onAddressSelect) {
          onAddressSelect(defaultAddress);
        }
      }

      if (onAddressChange) {
        onAddressChange(data);
      }
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

  const handleCreateAddress = async (values: any) => {
    try {
      setIsLoading(true);
      const newAddress = await createAddress(values);
      const updatedAddresses = [...addresses, newAddress];
      setAddresses(updatedAddresses);

      if (onAddressChange) {
        onAddressChange(updatedAddresses);
      }

      // Auto-select the new address in select mode
      if (mode === "select" && onAddressSelect) {
        onAddressSelect(newAddress);
      }

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
      const updatedAddresses = addresses.filter(
        (addr) => addr.id !== addressId
      );
      setAddresses(updatedAddresses);

      if (onAddressChange) {
        onAddressChange(updatedAddresses);
      }

      // Clear selection if deleted address was selected
      if (selectedAddress?.id === addressId && onAddressSelect) {
        onAddressSelect(null);
      }

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
      await setDefaultAddress(addressId);
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        is_default: addr.id === addressId,
      }));
      setAddresses(updatedAddresses);

      if (onAddressChange) {
        onAddressChange(updatedAddresses);
      }

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

  const handleAddressSelect = (addressId: string | null) => {
    if (!addressId || !onAddressSelect) return;

    const address = addresses.find((addr) => addr.id.toString() === addressId);
    if (address) {
      onAddressSelect(address);
    }
  };

  if (isFetching) {
    return (
      <Stack align="center" py="xl">
        <Text>Loading addresses...</Text>
      </Stack>
    );
  }

  if (mode === "select") {
    const addressOptions = addresses.map((address) => ({
      value: address.id.toString(),
      label: `${address.street}, ${address.city}${
        address.is_default ? " (Default)" : ""
      }`,
    }));

    return (
      <Stack gap="md">
        {addresses.length > 0 && (
          <Select
            label="Select Address"
            placeholder="Choose an existing address"
            data={addressOptions}
            value={selectedAddress?.id.toString() || null}
            onChange={handleAddressSelect}
            clearable={false}
          />
        )}

        {isAddingNew ? (
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Add New Address
            </Text>
            <form onSubmit={form.onSubmit(handleCreateAddress)}>
              <Stack gap="md">
                <TextInput
                  withAsterisk
                  label="Street Address"
                  placeholder="123 Main St"
                  {...form.getInputProps("street")}
                />
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      withAsterisk
                      label="City"
                      placeholder="City"
                      {...form.getInputProps("city")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      withAsterisk
                      label="State"
                      placeholder="State"
                      {...form.getInputProps("state")}
                    />
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      withAsterisk
                      label="Country"
                      placeholder="Country"
                      {...form.getInputProps("country")}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      withAsterisk
                      label="Postal Code"
                      placeholder="12345"
                      {...form.getInputProps("postal_code")}
                    />
                  </Grid.Col>
                </Grid>
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
          </Box>
        ) : (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setIsAddingNew(true)}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Add New Address
          </Button>
        )}

        {showContactInfo && contactInfo && onContactInfoChange && (
          <Stack gap="md">
            <Text size="sm" fw={500} mb="xs">
              Contact Information
            </Text>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={contactInfo.fullName}
                  onChange={(e) =>
                    onContactInfoChange("fullName", e.target.value)
                  }
                  required
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={contactInfo.phone}
                  onChange={(e) => onContactInfoChange("phone", e.target.value)}
                  required
                />
              </Grid.Col>
            </Grid>
          </Stack>
        )}
      </Stack>
    );
  }

  // Manage mode
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
          <form onSubmit={form.onSubmit(handleCreateAddress)}>
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
