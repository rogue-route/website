/**
 * Rogue Route waitlist API.
 *
 * Requests are normalized, upserted into Supabase, and added to the Brevo
 * Waitlist list. An optional Brevo founder notification is controlled by an
 * explicit server-side environment flag.
 */
import { createClient } from "@supabase/supabase-js";
import { waitlistSubmissionSchema } from "@/lib/validations/waitlist";

const BREVO_CONTACTS_API_URL = "https://api.brevo.com/v3/contacts";
const BREVO_EMAIL_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_TIMEOUT_MS = 10_000;
const MAX_REQUEST_BYTES = 8_192;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const rateLimitEntries = new Map<
  string,
  { count: number; resetAt: number }
>();

function errorResponse(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
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

async function parseBody(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return { ok: false as const, status: 413 };
  }

  const text = await request.text();

  if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) {
    return { ok: false as const, status: 413 };
  }

  try {
    return { ok: true as const, body: JSON.parse(text) as unknown };
  } catch {
    return { ok: false as const, status: 400 };
  }
}

async function brevoFetch(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BREVO_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function isObviouslyPublicSupabaseKey(key: string) {
  if (key.startsWith("sb_publishable_")) return true;
  if (!key.startsWith("eyJ")) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(key.split(".")[1], "base64url").toString("utf8")
    ) as { role?: string };

    return payload.role === "anon" || payload.role === "authenticated";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (await isRateLimited(request)) {
      return errorResponse(
        "Too many requests. Please wait before trying again.",
        429
      );
    }

    const parsed = await parseBody(request);

    if (!parsed.ok) {
      return errorResponse(
        parsed.status === 413 ? "Request is too large." : "Invalid request.",
        parsed.status
      );
    }

    const result = waitlistSubmissionSchema.safeParse(parsed.body);

    if (!result.success) {
      return errorResponse(
        result.error.issues[0]?.message ?? "Invalid input.",
        400
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoWaitlistListId = Number(process.env.BREVO_WAITLIST_LIST_ID);

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error("[waitlist] Supabase server configuration is missing.");
      return errorResponse(
        "Waitlist service is temporarily unavailable. Please try again later.",
        503
      );
    }

    if (isObviouslyPublicSupabaseKey(supabaseServiceRoleKey)) {
      console.error(
        "[waitlist] SUPABASE_SERVICE_ROLE_KEY contains a public credential."
      );
      return errorResponse(
        "Waitlist service is temporarily unavailable due to a server configuration error.",
        503
      );
    }

    if (
      !brevoApiKey ||
      !Number.isInteger(brevoWaitlistListId) ||
      brevoWaitlistListId <= 0
    ) {
      return errorResponse(
        "Waitlist service is temporarily unavailable. Please try again later.",
        503
      );
    }

    const { name, email } = result.data;
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: upsertError } = await supabase
      .from("waitlist_submissions")
      .upsert(
        { name, email, updated_at: new Date().toISOString() },
        { onConflict: "email" }
      );

    if (upsertError) {
      console.error("[waitlist] Supabase upsert failed.", {
        code: upsertError.code,
      });
      return errorResponse(
        "Unable to join the waitlist right now. Please try again later.",
        503
      );
    }

    const contactResponse = await brevoFetch(BREVO_CONTACTS_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: { FNAME: name },
        listIds: [brevoWaitlistListId],
        updateEnabled: true,
      }),
    });

    if (!contactResponse?.ok) {
      console.error("[waitlist] Brevo contact sync failed.", {
        status: contactResponse?.status ?? "network_error",
      });
      return errorResponse(
        "Your details were saved, but the waitlist service could not finish. Please try again.",
        502
      );
    }

    const founderNotificationsEnabled =
      process.env.WAITLIST_FOUNDER_NOTIFICATIONS_ENABLED === "true";
    const brevoFromEmail = process.env.BREVO_FROM_EMAIL;
    const notifyEmail = process.env.NOTIFY_EMAIL;

    if (founderNotificationsEnabled && brevoFromEmail && notifyEmail) {
      const notificationResponse = await brevoFetch(BREVO_EMAIL_API_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "RogueRoute Website", email: brevoFromEmail },
          to: [{ email: notifyEmail }],
          subject: "New Rogue Route waitlist signup",
          textContent: [
            "A visitor joined the Rogue Route waitlist.",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
          ].join("\n"),
        }),
      });

      if (!notificationResponse?.ok) {
        console.warn("[waitlist] Founder notification failed.", {
          status: notificationResponse?.status ?? "network_error",
        });
      }
    }

    return Response.json({ ok: true });
  } catch {
    console.error("[waitlist] Unexpected server error.");
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
