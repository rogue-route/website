/**
 * Waitlist API — Task 6.1
 *
 * Validates the submitted email, then sends a notification to the founder
 * via Resend. Falls back to console.log if RESEND_API_KEY is not set
 * (keeps the route working in dev without credentials).
 *
 * Sender:  noreply@gorogueroute.com  (must be verified in Resend dashboard)
 * Fallback sender used until domain is verified: onboarding@resend.dev
 * Recipient: set via NOTIFY_EMAIL env var (defaults to abhivellala@gmail.com)
 */
import { Resend } from "resend";
import { waitlistSchema } from "@/lib/validations/waitlist";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "abhivellala@gmail.com";
const FROM_EMAIL =
  process.env.FROM_EMAIL ?? "RogueRoute <onboarding@resend.dev>";

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

    const { email } = result.data;

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        subject: "New waitlist signup — RogueRoute",
        html: `
          <p style="font-family:sans-serif;font-size:15px;color:#111110">
            A new visitor joined the RogueRoute waitlist.
          </p>
          <p style="font-family:sans-serif;font-size:15px;color:#111110">
            <strong>Email:</strong> ${email}
          </p>
          <p style="font-family:monospace;font-size:12px;color:#6B6B67">
            ${new Date().toISOString()}
          </p>
        `,
      });
    } else {
      // Dev fallback: no API key configured
      console.log("[waitlist] new signup (Resend not configured):", email);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[waitlist] error:", err);
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
