import {
  addressInputSchema,
  addressSchema,
  type Address,
} from "@/schemas/address";
import apiClient from "lib/api-client";
import { z } from "zod";

// Type definitions
export interface SellerVerificationForm {
  first_name: string;
  last_name: string;
  tax_id?: string;
  bank_brand: string;
  bank_number: string;
  bank_branch: string;
  type: "individual" | "corporation";
}

// Zod schema for validation
export const verificationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  tax_id: z.string().optional(),
  bank_brand: z.string().min(1, "Bank name is required"),
  bank_number: z.string().min(1, "Account number is required"),
  bank_branch: z.string().min(1, "Branch is required"),
  type: z.enum(["individual", "corporation"]),
});

export async function createAddress(
  data: z.infer<typeof addressInputSchema>
): Promise<Address> {
  try {
    // Validate input data
    const validatedData = addressInputSchema.parse(data);

    // Check if this is the first address
    const currentAddresses = await getAddresses();
    const isFirstAddress = currentAddresses.length === 0;

    // Create the address
    const response = await apiClient.post("/addresses", validatedData);
    const newAddress = addressSchema.parse(response.data);

    // If it's the first address, set it as default
    if (isFirstAddress) {
      await setDefaultAddress(newAddress.id);
      const addresses = await getAddresses();
      return addresses.find((addr) => addr.id === newAddress.id)!;
    }

    return newAddress;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid address data");
    }
    throw new Error(
      error.response?.data?.detail ||
        error.message ||
        "Failed to create address"
    );
  }
}

export async function getAddresses(): Promise<Address[]> {
  try {
    const response = await apiClient.get("/addresses");
    return z.array(addressSchema).parse(response.data);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid address data received from server");
    }
    throw new Error(
      error.response?.data?.detail ||
        error.message ||
        "Failed to fetch addresses"
    );
  }
}

export async function deleteAddress(addressId: number): Promise<void> {
  try {
    await apiClient.delete(`/addresses/${addressId}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail ||
        error.message ||
        "Failed to delete address"
    );
  }
}

export async function setDefaultAddress(addressId: number): Promise<Address> {
  try {
    const response = await apiClient.post(
      `/addresses/${addressId}/set-default`
    );
    return addressSchema.parse(response.data);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid address data received from server");
    }
    throw new Error(
      error.response?.data?.detail ||
        error.message ||
        "Failed to set default address"
    );
  }
}

export async function updateAddress(
  addressId: number,
  data: z.infer<typeof addressInputSchema>
): Promise<Address> {
  try {
    const validatedData = addressInputSchema.parse(data);
    const response = await apiClient.put(
      `/addresses/${addressId}`,
      validatedData
    );
    return addressSchema.parse(response.data);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid address data");
    }
    throw new Error(
      error.response?.data?.detail ||
        error.message ||
        "Failed to update address"
    );
  }
}

export async function submitVerification(data: SellerVerificationForm) {
  try {
    const validatedData = verificationSchema.parse(data);

    await apiClient.post("/recipient/verify", {
      ...validatedData,
      name: `${validatedData.first_name} ${validatedData.last_name}`.trim(),
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: "Validation failed", details: error.errors };
    }
    return {
      error:
        error.response?.data?.detail ||
        error.message ||
        "Failed to submit verification",
    };
  }
}
