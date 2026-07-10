/**
 * Contact API — Task 6.1
 *
 * Validates name/email/message, then sends the message to the founder
 * via Resend. Falls back to console.log if RESEND_API_KEY is not set.
 *
 * Sender:  noreply@gorogueroute.com  (must be verified in Resend dashboard)
 * Recipient: set via NOTIFY_EMAIL env var (defaults to abhivellala@gmail.com)
 */
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations/contact";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "abhivellala@gmail.com";
const FROM_EMAIL =
  process.env.FROM_EMAIL ?? "RogueRoute <onboarding@resend.dev>";

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

    const { name, email, message } = result.data;

    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFY_EMAIL,
        replyTo: email,
        subject: `New contact message from ${name} — RogueRoute`,
        html: `
          <p style="font-family:sans-serif;font-size:15px;color:#111110">
            A visitor sent a message via the RogueRoute contact form.
          </p>
          <table style="font-family:sans-serif;font-size:14px;color:#111110;border-collapse:collapse">
            <tr><td style="padding:4px 12px 4px 0;color:#6B6B67">Name</td><td>${name}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#6B6B67">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          </table>
          <div style="margin-top:16px;padding:12px 16px;background:#F8F7F4;border-left:3px solid #1C3A2F;font-family:sans-serif;font-size:14px;color:#111110;line-height:1.65;white-space:pre-wrap">${message}</div>
          <p style="font-family:monospace;font-size:12px;color:#6B6B67;margin-top:16px">
            ${new Date().toISOString()}
          </p>
        `,
      });
    } else {
      // Dev fallback: no API key configured
      console.log("[contact] new message (Resend not configured):", { name, email, message });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
