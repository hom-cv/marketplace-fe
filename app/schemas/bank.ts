import { z } from "zod";

export const bankSchema = z.object({
  code: z.string(),
  name: z.string(),
  icon: z.string(),
});

export type Bank = z.infer<typeof bankSchema>;
