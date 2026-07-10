"use client";
/**
 * ContactForm — Task 2.4
 *
 * Compound component: name / email / message fields, Zod client-side
 * validation, /api/contact POST, loading / success / error states.
 *
 * Why "use client": multiple useState hooks + form handler.
 *
 * Textarea: uses a native <textarea> styled with Tailwind to match the
 * Input primitive. No shadcn Textarea installed — native element is
 * simpler and AGENTS.md § 9 prefers native over custom-built when equal.
 *
 * Three-state UI:
 *   idle    → normal form
 *   loading → button disabled, text "Sending…"
 *   success → replacement confirmation card (same pattern as NewsletterForm)
 *   error   → inline field/form errors, form stays editable
 */

import { useState } from "react";
import { Input } from "@/components/primitives/Input";
import { Label } from "@/components/primitives/Label";
import { Button } from "@/components/primitives/Button";
import { contactSchema } from "@/lib/validations/contact";

type FormState = "idle" | "loading" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
  form?: string;
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  function clearFieldError(field: keyof FieldErrors) {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (formState === "error") setFormState("idle");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const result = contactSchema.safeParse({ name, email, message });
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setFormState("error");
      return;
    }

    setFormState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data: { ok: boolean; error?: string } = await res.json();

      if (data.ok) {
        setFormState("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setFormState("error");
        setErrors({ form: data.error ?? "Something went wrong. Please try again." });
      }
    } catch {
      setFormState("error");
      setErrors({ form: "Network error. Please try again." });
    }
  }

  if (formState === "success") {
    return (
      <div
        className="rounded-lg border border-fog bg-true-white px-6 py-8 text-center"
        role="status"
        aria-live="polite"
      >
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
          Message received.
        </p>
        <p
          className="mt-1 text-sm text-ash"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          We'll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  const isLoading = formState === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          type="text"
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
          disabled={isLoading}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          autoComplete="name"
          required
        />
        {errors.name && (
          <p
            id="contact-name-error"
            role="alert"
            className="text-xs text-terracotta"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="contact-email">Email address</Label>
        <Input
          id="contact-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError("email");
          }}
          disabled={isLoading}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          autoComplete="email"
          required
        />
        {errors.email && (
          <p
            id="contact-email-error"
            role="alert"
            className="text-xs text-terracotta"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Message — native <textarea> styled to match Input primitive */}
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <textarea
          id="contact-message"
          placeholder="Tell us what's on your mind…"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            clearFieldError("message");
          }}
          disabled={isLoading}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          rows={5}
          required
          // Mirror Input primitive styles: same border, radius, focus ring,
          // and font so the field reads as part of the same design system.
          className="w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm text-carbon placeholder:text-ash transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
          style={{ fontFamily: "var(--font-dm-sans)", lineHeight: 1.65 }}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            className="text-xs text-terracotta"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* Form-level error (API failure) */}
      {errors.form && (
        <p
          role="alert"
          className="text-xs text-terracotta"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {errors.form}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
