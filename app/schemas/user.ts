import { z } from "zod";

export const userSchema = z.object({
  id: z.union([z.string(), z.number()]),
  username: z.string().min(1),
  email_address: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE"]),
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
