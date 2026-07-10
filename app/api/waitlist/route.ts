/**
 * Waitlist API — Task 2.3
 *
 * Validates the submitted email with the shared Zod schema and logs it.
 * Real storage (Supabase) and email delivery (Resend) wired in Phase 6.
 * Returns typed JSON so the client form can read ok/error cleanly.
 */
import { waitlistSchema } from "@/lib/validations/waitlist";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = waitlistSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { ok: false, error: result.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    // Placeholder: log the email. Phase 6 replaces this with real storage.
    console.log("[waitlist] new signup:", result.data.email);

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
