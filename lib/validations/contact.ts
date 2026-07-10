/**
 * Contact form validation schema — Task 2.4
 *
 * Shared between the API route (server) and ContactForm component (client)
 * to keep validation logic in one place.
 */
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(2000, "Message must be 2000 characters or fewer."),
});

export type ContactInput = z.infer<typeof contactSchema>;
