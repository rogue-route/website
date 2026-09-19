import { z } from "zod";

export const newsletterSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .max(254, "Email must be 254 characters or fewer.")
      .email("Please enter a valid email address.")
      .transform((value) => value.toLowerCase()),
  })
  .strict();

export type NewsletterInput = z.infer<typeof newsletterSchema>;
