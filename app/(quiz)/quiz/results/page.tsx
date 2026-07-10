/**
 * Quiz Results page — Task 4.8
 *
 * Shows the final combined result after both stages.
 * Submits all answers to /api/quiz/submit on first render.
 * Offers email capture via NewsletterForm (reused compound).
 *
 * "use client" — reads from QuizContext, submits data, manages local state.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuiz } from "@/components/layouts/QuizProvider";
import { NewsletterForm } from "@/components/compounds/forms/NewsletterForm";
import { buttonVariants } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import {
  getStage1Result,
  getStage2Result,
  sumAnswers,
} from "@/lib/quiz/scoring";
import type { QuizSubmission } from "@/lib/quiz/types";

export default function QuizResultsPage() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();
  const hasSubmitted = useRef(false);
  const [submitError, setSubmitError] = useState("");

  // Guard: if quiz hasn't been completed, redirect to start
  useEffect(() => {
    if (state.stage1Answers.length === 0 || state.stage2Answers.length === 0) {
      router.replace("/quiz");
    }
  }, [state.stage1Answers.length, state.stage2Answers.length, router]);

  const stage1Score = sumAnswers(state.stage1Answers);
  const stage2Score = sumAnswers(state.stage2Answers);
  const stage1Result = getStage1Result(stage1Score);
  const stage2Result = getStage2Result(stage2Score);

  // Submit to API once on mount (idempotent — ref guards against double-fire)
  useEffect(() => {
    if (hasSubmitted.current) return;
    if (state.stage1Answers.length === 0 || state.stage2Answers.length === 0) return;

    hasSubmitted.current = true;

    const payload: QuizSubmission = {
      stage1Answers: state.stage1Answers,
      stage1Score,
      stage1Tier: stage1Result.tier,
      stage2Answers: state.stage2Answers,
      stage2Score,
      stage2Tier: stage2Result.tier,
      submittedAt: new Date().toISOString(),
    };

    fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data: { ok: boolean; error?: string }) => {
        if (!data.ok) {
          setSubmitError(data.error ?? "Submission failed.");
        }
      })
      .catch(() => setSubmitError("Network error — your results were not saved."));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If quiz is incomplete (guard not yet kicked in), render nothing
  if (state.stage1Answers.length === 0 || state.stage2Answers.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-[560px] space-y-6">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div>
        <p
          className="mb-2 text-xs text-ash"
          style={{ fontFamily: "var(--font-dm-mono)", letterSpacing: "0.06em" }}
        >
          Your results
        </p>
        <h1
          className="text-carbon"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(28px, 6vw, 52px)",
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          Full skin tolerance profile.
        </h1>
      </div>

      {/* ── Stage 1 summary card ────────────────────────────────────── */}
      <div className="rounded-xl border border-fog bg-true-white p-5">
        <div className="mb-3 flex items-baseline gap-3">
          <span
            className="text-carbon"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "32px",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {stage1Score}
          </span>
          <span className="text-xs text-ash" style={{ fontFamily: "var(--font-dm-mono)" }}>
            / 16 — Stage 1
          </span>
        </div>
        <p
          className="text-sm text-ash"
          style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300, lineHeight: 1.65 }}
        >
          {stage1Result.resultText}
        </p>
      </div>

      {/* ── Stage 2 summary card ────────────────────────────────────── */}
      <div className="rounded-xl border border-fog bg-true-white p-5">
        <div className="mb-3 flex items-baseline gap-3">
          <span
            className="text-carbon"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "32px",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {stage2Score}
          </span>
          <span className="text-xs text-ash" style={{ fontFamily: "var(--font-dm-mono)" }}>
            / 22 — Stage 2
          </span>
        </div>
        <p
          className="text-sm text-ash"
          style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300, lineHeight: 1.65 }}
        >
          {stage2Result.resultText}
        </p>
      </div>

      {/* ── Email capture ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-fog bg-true-white p-5">
        <p
          className="mb-1 text-xs font-medium tracking-[0.08em] uppercase text-ash"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Stay informed
        </p>
        <p
          className="mb-5 text-carbon"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(20px, 4vw, 28px)",
            fontWeight: 400,
            lineHeight: 1.2,
          }}
        >
          Be first to know when we launch.
        </p>
        <NewsletterForm />
      </div>

      {/* Submission error — non-blocking, informational only */}
      {submitError && (
        <p
          className="text-xs text-terracotta"
          style={{ fontFamily: "var(--font-dm-sans)" }}
          role="alert"
        >
          {submitError}
        </p>
      )}

      {/* Retake / go home */}
      <div className="flex flex-col gap-3 pb-8">
        <button
          onClick={() => {
            dispatch({ type: "RESET" });
            router.push("/quiz");
          }}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full"
          )}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Retake quiz
        </button>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "w-full text-center"
          )}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Back to home
        </Link>
      </div>

    </div>
  );
}
