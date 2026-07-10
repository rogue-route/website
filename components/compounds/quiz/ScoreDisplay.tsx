"use client";
/**
 * ScoreDisplay — Task 4.6
 *
 * Shown after each stage completes. Displays:
 *   - Count-up score animation (PROJECT.md § 5: "Count-up number animation")
 *   - Result tier text (from quiz_questionnaire.md)
 *   - Primary CTA (always present)
 *   - Optional secondary CTA
 *
 * Count-up animation:
 *   useEffect + setInterval increments a display counter from 0 to the real
 *   score over ~800ms. Simple, no Framer Motion needed — the spec says
 *   "count-up number animation" which is naturally a JS counter.
 *
 * CTA behaviour:
 *   Stage 1: onContinue dispatches START_STAGE_2 then Next.js router pushes
 *   to /quiz/stage-2. The router.push is triggered by the parent page passing
 *   an onContinue callback — keeps navigation logic in the page, not here.
 *   Stage 2: CTAs link to /#waitlist (results page handles routing).
 *
 * Tier display label — derived from tier key for clean presentation.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import type { StageResult, StageTier } from "@/lib/quiz/types";

interface ScoreDisplayProps {
  result: StageResult;
  /**
   * For Stage 1: called when the primary CTA is clicked, before navigation.
   * (Dispatches START_STAGE_2 so state is ready when Stage 2 page mounts.)
   * For Stage 2: not used — CTAs are plain links.
   */
  onContinue?: () => void;
}

const TIER_LABELS: Record<StageTier, string> = {
  HIGH_REACTIVITY:      "High Reactivity Profile",
  MODERATE_SENSITIVITY: "Moderate Sensitivity Profile",
  LOW_SENSITIVITY:      "Low Sensitivity / Occasional Issues",
  LOW_RELEVANCE:        "Low Reactivity Profile",
  CORE_PMF:             "Core Profile",
  STRONG_FIT:           "Strong Fit",
  WEAK_FIT:             "Occasional Sensitivity",
};

/** Max possible scores per stage — used to compute display range label. */
const MAX_SCORE: Record<1 | 2, number> = { 1: 16, 2: 22 };

export function ScoreDisplay({ result, onContinue }: ScoreDisplayProps) {
  const router = useRouter();
  const [displayScore, setDisplayScore] = useState(0);
  // Tracks whether the count-up has finished — used to fire the
  // accessible announcement exactly once (not on every increment).
  const [announced, setAnnounced] = useState(false);

  // Count-up animation — increments from 0 to result.score over ~800ms
  useEffect(() => {
    setAnnounced(false);
    if (result.score === 0) {
      setDisplayScore(0);
      setAnnounced(true);
      return;
    }

    const duration = 800; // ms
    const steps = Math.min(result.score, 30); // cap steps so it doesn't drag
    const interval = duration / steps;
    const increment = result.score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= result.score) {
        setDisplayScore(result.score);
        setAnnounced(true); // fires aria-live announcement exactly once
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [result.score]);

  function handlePrimaryCta() {
    if (onContinue) {
      onContinue();
      router.push(result.primaryCtaHref);
    }
    // If no onContinue, the primary CTA is a plain link (handled below)
  }

  return (
    <div className="w-full max-w-[560px]">
      <div className="rounded-xl border border-fog bg-true-white p-6 md:p-8">

        {/* Stage label */}
        <p
          className="mb-2 text-xs text-ash"
          style={{
            fontFamily: "var(--font-dm-mono)",
            fontWeight: 400,
            letterSpacing: "0.06em",
          }}
        >
          Stage {result.stage} result
        </p>

        {/* Score count-up — DM Mono, large.
             The visible span is presentational (aria-hidden); a separate
             visually-hidden span fires aria-live exactly once when the
             count finishes — avoids announcing every intermediate number. */}
        <div className="mb-6 flex items-end gap-2">
          <span
            aria-hidden="true"
            className="text-carbon"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "clamp(48px, 10vw, 80px)",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {displayScore}
          </span>
          <span
            className="mb-1 text-ash"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "18px",
              fontWeight: 400,
            }}
            aria-hidden="true"
          >
            / {MAX_SCORE[result.stage]}
          </span>
        </div>
        {/* Accessible score announcement — fires once when count completes */}
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announced
            ? `Your score: ${result.score} out of ${MAX_SCORE[result.stage]}`
            : ""}
        </span>

        {/* Tier label — Parchment badge */}
        <span
          className="mb-4 inline-block rounded border border-parchment bg-parchment/20 px-2 py-0.5 text-xs text-carbon"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          {TIER_LABELS[result.tier]}
        </span>

        {/* Result text — from quiz_questionnaire.md */}
        <p
          className="mb-8 text-ash"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "16px",
            fontWeight: 300,
            lineHeight: 1.65,
          }}
        >
          {result.resultText}
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          {/* Primary CTA */}
          {onContinue ? (
            // Stage 1: button that dispatches + navigates
            <button
              onClick={handlePrimaryCta}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {result.primaryCta}
            </button>
          ) : (
            // Stage 2 / Results: plain link
            <Link
              href={result.primaryCtaHref}
              className={cn(buttonVariants({ size: "lg" }), "w-full text-center")}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {result.primaryCta}
            </Link>
          )}

          {/* Secondary CTA — outline style */}
          {result.secondaryCta && result.secondaryCtaHref && (
            <Link
              href={result.secondaryCtaHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full text-center"
              )}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {result.secondaryCta}
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
