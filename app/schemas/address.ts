import { z } from "zod";

export const addressSchema = z.object({
  id: z.number(),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postal_code: z.string().min(1),
  is_default: z.boolean(),
});

export const addressInputSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postal_code: z.string().min(1, "Postal code is required"),
});

export type Address = z.infer<typeof addressSchema>;
export type AddressInput = z.infer<typeof addressInputSchema>;
