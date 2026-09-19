"use client";

import { useId, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { Label } from "@/components/primitives/Label";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { waitlistSchema } from "@/lib/validations/waitlist";

const waitlistFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required."),
  email: waitlistSchema.shape.email,
});

type FormState = "idle" | "loading" | "success" | "error";
type NewsletterState = "idle" | "loading" | "success" | "error";
type FieldName = "name" | "email";

type WaitlistFormProps = {
  showNewsletterOptIn?: boolean;
};

export function WaitlistForm({
  showNewsletterOptIn = false,
}: WaitlistFormProps) {
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const newsletterId = `${formId}-newsletter`;
  const errorId = `${formId}-error`;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errorField, setErrorField] = useState<FieldName | null>(null);
  const [newsletterState, setNewsletterState] =
    useState<NewsletterState>("idle");
  const [newsletterRetryEmail, setNewsletterRetryEmail] = useState("");

  function clearError() {
    if (formState === "error") {
      setFormState("idle");
      setMessage("");
      setErrorField(null);
    }
  }

  async function subscribeToNewsletterApi(normalizedEmail: string) {
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data: { ok: boolean } = await response.json();
      return response.ok && data.ok;
    } catch {
      return false;
    }
  }

  async function retryNewsletter() {
    if (!newsletterRetryEmail) return;

    setNewsletterState("loading");
    const subscribed = await subscribeToNewsletterApi(newsletterRetryEmail);
    setNewsletterState(subscribed ? "success" : "error");
    if (subscribed) setNewsletterRetryEmail("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorField(null);
    setNewsletterState("idle");
    setNewsletterRetryEmail("");

    const result = waitlistFormSchema.safeParse({ name, email });

    if (!result.success) {
      const issue = result.error.issues[0];
      const field = issue?.path[0];

      setFormState("error");
      setErrorField(field === "name" || field === "email" ? field : null);
      setMessage(issue?.message ?? "Invalid input.");
      return;
    }

    const wantsNewsletter = showNewsletterOptIn && subscribeToNewsletter;
    const newsletterResult = wantsNewsletter
      ? newsletterSchema.safeParse({ email: result.data.email })
      : null;

    if (newsletterResult && !newsletterResult.success) {
      setFormState("error");
      setErrorField("email");
      setMessage(
        newsletterResult.error.issues[0]?.message ?? "Invalid email."
      );
      return;
    }

    setFormState("loading");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data: { ok: boolean; error?: string } = await response.json();

      if (!data.ok) {
        setFormState("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (newsletterResult?.success) {
        setNewsletterState("loading");
        const normalizedEmail = newsletterResult.data.email;
        const subscribed = await subscribeToNewsletterApi(normalizedEmail);
        setNewsletterState(subscribed ? "success" : "error");
        if (!subscribed) setNewsletterRetryEmail(normalizedEmail);
      }

      setFormState("success");
      setName("");
      setEmail("");
      setSubscribeToNewsletter(false);
    } catch {
      setFormState("error");
      setMessage("Network error. Please try again.");
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
          You&apos;re on the list.
        </p>
        <p
          className="mt-1 text-sm text-ash"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          We&apos;ll reach out as soon as we launch.
        </p>
        {newsletterState === "success" && (
          <p
            className="mt-3 text-sm text-ash"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Your newsletter subscription is confirmed.
          </p>
        )}
        {newsletterState === "error" && (
          <div className="mt-4 space-y-3">
            <p
              className="text-sm text-terracotta"
              style={{ fontFamily: "var(--font-dm-sans)" }}
              role="alert"
            >
              You joined the waitlist, but the newsletter subscription could
              not be completed.
            </p>
            <Button type="button" variant="outline" onClick={retryNewsletter}>
              Retry newsletter subscription
            </Button>
          </div>
        )}
        {newsletterState === "loading" && (
          <p
            className="mt-3 text-sm text-ash"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Retrying newsletter subscription…
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={nameId}>Name</Label>
        <Input
          id={nameId}
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            clearError();
          }}
          disabled={formState === "loading"}
          aria-invalid={errorField === "name"}
          aria-describedby={errorField === "name" ? errorId : undefined}
          autoComplete="name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={emailId}>Email address</Label>
        <Input
          id={emailId}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearError();
          }}
          disabled={formState === "loading"}
          aria-invalid={errorField === "email"}
          aria-describedby={errorField === "email" ? errorId : undefined}
          autoComplete="email"
          required
        />
      </div>

      {showNewsletterOptIn && (
        <div className="flex items-start gap-3 rounded-lg border border-fog p-3">
          <input
            id={newsletterId}
            type="checkbox"
            checked={subscribeToNewsletter}
            onChange={(event) => setSubscribeToNewsletter(event.target.checked)}
            disabled={formState === "loading"}
            className="mt-0.5 h-4 w-4 shrink-0 accent-forest-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-ink focus-visible:ring-offset-2"
          />
          <Label
            htmlFor={newsletterId}
            className="cursor-pointer text-sm font-normal leading-5 text-carbon"
          >
            Also subscribe me to the RogueRoute newsletter.
          </Label>
        </div>
      )}

      {formState === "error" && message && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-terracotta"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {message}
        </p>
      )}

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
