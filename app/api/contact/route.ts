/**
 * Contact API
 *
 * Validates and stores contact submissions in Supabase before sending a
 * plain-text notification through Brevo. Temporary Supabase diagnostics are
 * redacted before server logging and are never returned to the browser.
 */
import { createClient } from "@supabase/supabase-js";
import { contactSchema } from "@/lib/validations/contact";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_CONTACTS_API_URL = "https://api.brevo.com/v3/contacts";
const NOTIFY_EMAIL = "rogueroute01@gmail.com";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const BREVO_TIMEOUT_MS = 10_000;

const rateLimitEntries = new Map<
  string,
  { count: number; resetAt: number }
>();

function errorResponse(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}

function redactDiagnostic(
  value: string | null,
  sensitiveValues: Array<string | undefined>
) {
  if (!value) return value;

  let redacted = value;

  for (const sensitiveValue of sensitiveValues) {
    if (sensitiveValue) {
      redacted = redacted.replaceAll(sensitiveValue, "[REDACTED]");
    }
  }

  return redacted;
}

async function getRateLimitKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const address =
    request.headers.get("cf-connecting-ip") ?? forwardedFor?.trim() ?? "unknown";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(address)
  );

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

async function isRateLimited(request: Request) {
  const now = Date.now();

  for (const [key, entry] of rateLimitEntries) {
    if (entry.resetAt <= now) rateLimitEntries.delete(key);
  }

  const key = await getRateLimitKey(request);
  const entry = rateLimitEntries.get(key);

  if (!entry) {
    rateLimitEntries.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    if (await isRateLimited(request)) {
      return errorResponse(
        "Too many requests. Please wait before trying again.",
        429
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid request.", 400);
    }

    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(
        result.error.issues[0]?.message ?? "Invalid input.",
        400
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return errorResponse(
        "Contact service is temporarily unavailable. Please try again later.",
        503
      );
    }

    const { name, email, message } = result.data;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert({ name, email, message });

    if (insertError) {
      const sensitiveValues = [
        supabaseUrl,
        supabaseServiceRoleKey,
        process.env.BREVO_API_KEY,
        name,
        email,
        message,
      ];

      console.error("[contact] Supabase insert failed", {
        code: redactDiagnostic(insertError.code, sensitiveValues),
        message: redactDiagnostic(insertError.message, sensitiveValues),
        details: redactDiagnostic(insertError.details, sensitiveValues),
        hint: redactDiagnostic(insertError.hint, sensitiveValues),
      });

      return errorResponse(
        "Unable to submit your message right now. Please try again later.",
        503
      );
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoFromEmail = process.env.BREVO_FROM_EMAIL;
    const brevoContactUsListId = Number(
      process.env.BREVO_CONTACT_US_LIST_ID
    );

    if (
      !brevoApiKey ||
      !brevoFromEmail ||
      !Number.isInteger(brevoContactUsListId) ||
      brevoContactUsListId <= 0
    ) {
      return errorResponse(
        "Your message was saved, but the notification could not be sent.",
        503
      );
    }

    const contactsController = new AbortController();
    const contactsTimeout = setTimeout(
      () => contactsController.abort(),
      BREVO_TIMEOUT_MS
    );
    let contactsResponse: Response;

    try {
      contactsResponse = await fetch(BREVO_CONTACTS_API_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          attributes: { FNAME: name },
          listIds: [brevoContactUsListId],
          updateEnabled: true,
        }),
        signal: contactsController.signal,
      });
    } catch {
      return errorResponse(
        "Your message was saved, but the notification could not be sent.",
        502
      );
    } finally {
      clearTimeout(contactsTimeout);
    }

    if (!contactsResponse.ok) {
      return errorResponse(
        "Your message was saved, but the notification could not be sent.",
        502
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), BREVO_TIMEOUT_MS);
    let brevoResponse: Response;

    try {
      brevoResponse = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "RogueRoute Website", email: brevoFromEmail },
          to: [{ email: NOTIFY_EMAIL }],
          replyTo: { name, email },
          subject: "New RogueRoute contact form submission",
          textContent: [
            "A visitor sent a message through the RogueRoute contact form.",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            "",
            "Message:",
            message,
          ].join("\n"),
        }),
        signal: controller.signal,
      });
    } catch {
      return errorResponse(
        "Your message was saved, but the notification could not be sent.",
        502
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!brevoResponse.ok) {
      return errorResponse(
        "Your message was saved, but the notification could not be sent.",
        502
      );
    }

    return Response.json({ ok: true });
  } catch {
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
