/**
 * Waitlist validation schema — Task 2.3
 *
 * Used by both the API route (server-side) and the form component (client-side)
 * to avoid duplicating validation logic. Zod is the locked tech stack choice
 * per AGENTS.md and TASK.md 2.3.
 */
import { z } from "zod";

export const waitlistSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

/**
 * Dedicated landing/results waitlist payload. The email-only schema above is
 * intentionally retained for the legacy NewsletterForm caller.
 */
export const waitlistSubmissionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(100, "Name must be 100 characters or fewer."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .max(254, "Email must be 254 characters or fewer.")
      .email("Please enter a valid email address.")
      .transform((value) => value.toLowerCase()),
    subscribeToNewsletter: z.boolean().optional().default(false),
  })
  .strict();

export type WaitlistSubmissionInput = z.infer<
  typeof waitlistSubmissionSchema
>;
