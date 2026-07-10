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
