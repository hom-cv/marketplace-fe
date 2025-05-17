import { z } from "zod";

// Add Recipient schema
export const recipientSchema = z.object({
  id: z.number(),
  omise_id: z.string(),
  livemode: z.boolean(),
  verified: z.boolean(),
  bank_account_last_digits: z.string(),
  bank_account_bank_code: z.string(),
  bank_account_name: z.string(),
  active: z.boolean(),
  // Add more fields as needed from your backend response
});
export type Recipient = z.infer<typeof recipientSchema>;

export const userSchema = z.object({
  id: z.union([z.string(), z.number()]),
  username: z.string().min(1),
  email_address: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE"]),
  recipient: recipientSchema.optional(), // Add recipient as optional
});

export type User = z.infer<typeof userSchema>;

export const registerSchema = z.object({
  email_address: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
});

export type RegisterData = z.infer<typeof registerSchema>;
