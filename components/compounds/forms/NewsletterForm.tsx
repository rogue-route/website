"use client";
/**
 * NewsletterForm — Task 2.3
 *
 * Compound component: owns local submit/success/error state,
 * calls /api/waitlist, shows inline feedback.
 *
 * Why "use client": useState + form submission handler.
 * Why compound (not section): no API fetch at render time,
 * only on user action — matches PROJECT.md component tier rules.
 *
 * Validation: Zod schema parsed client-side before the fetch so the
 * network round-trip only happens with valid data. The API validates
 * again server-side (defence in depth).
 *
 * Animation: PROJECT.md § 5 permits "Form submit — success checkmark /
 * inline error state". The success state is a simple CSS transition
 * (opacity + slight translate) — no Framer Motion needed here.
 */

import { useState } from "react";
import { Input } from "@/components/primitives/Input";
import { Label } from "@/components/primitives/Label";
import { Button } from "@/components/primitives/Button";
import { waitlistSchema } from "@/lib/validations/waitlist";

type FormState = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    // Client-side Zod validation — avoid unnecessary network request
    const result = waitlistSchema.safeParse({ email });
    if (!result.success) {
      setFormState("error");
      setMessage(result.error.issues[0]?.message ?? "Invalid email.");
      return;
    }

    setFormState("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: { ok: boolean; error?: string } = await res.json();

      if (data.ok) {
        setFormState("success");
        setEmail("");
      } else {
        setFormState("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormState("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (formState === "success") {
    return (
      // Success state — simple fade-in via Tailwind's animate-in utility
      <div
        className="rounded-lg border border-fog bg-true-white px-6 py-8 text-center"
        role="status"
        aria-live="polite"
      >
        {/* Checkmark — inline SVG, no library */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-ink/10">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-forest-ink"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p
          className="text-carbon"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          You're on the list.
        </p>
        <p
          className="mt-1 text-sm text-ash"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          We'll reach out as soon as we launch.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="waitlist-email">Email address</Label>
        <Input
          id="waitlist-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // Clear error when user starts typing again
            if (formState === "error") {
              setFormState("idle");
              setMessage("");
            }
          }}
          disabled={formState === "loading"}
          aria-invalid={formState === "error"}
          aria-describedby={
            formState === "error" ? "waitlist-error" : undefined
          }
          autoComplete="email"
          required
        />
        {/* Inline error message */}
        {formState === "error" && message && (
          <p
            id="waitlist-error"
            role="alert"
            className="text-xs text-terracotta"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={formState === "loading"}
        className="w-full"
      >
        {formState === "loading" ? "Joining…" : "Join the waitlist"}
      </Button>
    </form>
  );
}
