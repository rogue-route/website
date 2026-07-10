/**
 * Contact API — Task 2.4
 *
 * Validates name/email/message with the shared Zod schema and logs the
 * submission. Real email delivery (Resend) wired in Phase 6.
 */
import { contactSchema } from "@/lib/validations/contact";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { ok: false, error: result.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    // Placeholder: log the submission. Phase 6 replaces with real delivery.
    console.log("[contact] new message:", result.data);

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
