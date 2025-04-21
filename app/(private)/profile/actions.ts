import { Address } from "@/types/address";
import apiClient from "lib/api-client";

interface AddressInput {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export async function createAddress(data: AddressInput): Promise<Address> {
  try {
    // Check if this is the first address
    const currentAddresses = await getAddresses();
    const isFirstAddress = currentAddresses.length === 0;

    // Create the address
    const response = await apiClient.post("/addresses", data);
    const newAddress = response.data;

    // If it's the first address, set it as default
    if (isFirstAddress) {
      await setDefaultAddress(newAddress.id);
      return await getAddresses().then(
        (addresses) => addresses.find((addr) => addr.id === newAddress.id)!
      );
    }

    return newAddress;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to create address";
    throw new Error(message);
  }
}

export async function getAddresses(): Promise<Address[]> {
  try {
    const response = await apiClient.get("/addresses");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch addresses";
    throw new Error(message);
  }
}

export async function deleteAddress(addressId: number): Promise<void> {
  try {
    await apiClient.delete(`/addresses/${addressId}`);
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to delete address";
    throw new Error(message);
  }
}

export async function setDefaultAddress(addressId: number): Promise<Address> {
  try {
    const response = await apiClient.post(
      `/addresses/${addressId}/set-default`
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to set default address";
    throw new Error(message);
  }
}

export async function updateAddress(
  addressId: number,
  data: AddressInput
): Promise<Address> {
  try {
    const response = await apiClient.put(`/addresses/${addressId}`, data);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to update address";
    throw new Error(message);
  }
}
