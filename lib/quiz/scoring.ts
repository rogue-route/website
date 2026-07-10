/**
 * Quiz scoring — Task 4.1
 *
 * All thresholds and result texts are taken directly from quiz_questionnaire.md.
 * Do not change score ranges or result copy without updating the source document.
 *
 * Stage 1 range: 0–16  (multi-select, weighted options)
 * Stage 2 range: 0–22  (11 × Yes/Sometimes/No = 11 × max 2 = 22)
 */

import type { QuizAnswer, StageResult, StageTier } from "./types";
import { STAGE_1_QUESTIONS, STAGE_2_QUESTIONS } from "./questions";

// ---------------------------------------------------------------------------
// Score computation
// ---------------------------------------------------------------------------

/**
 * Computes the score for a single Stage 1 multi-select answer.
 * Handles the "None of the above" / "I don't avoid anything" override:
 * if a none-option is selected, the question contributes 0 points regardless
 * of any other selections.
 */
export function computeStage1QuestionScore(
  questionId: string,
  selectedIds: string[]
): number {
  const question = STAGE_1_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return 0;

  // If any none-option is selected, score = 0 (overrides all others)
  const hasNoneSelected = question.options.some(
    (opt) => opt.isNoneOption && selectedIds.includes(opt.id)
  );
  if (hasNoneSelected) return 0;

  return question.options
    .filter((opt) => selectedIds.includes(opt.id))
    .reduce((sum, opt) => sum + opt.score, 0);
}

/**
 * Computes the score for a single Stage 2 single-select answer.
 */
export function computeStage2QuestionScore(
  questionId: string,
  selectedIds: string[]
): number {
  const question = STAGE_2_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return 0;

  const selectedOption = question.options.find((opt) =>
    selectedIds.includes(opt.id)
  );
  return selectedOption?.score ?? 0;
}

/** Sums all answer scores for a stage. */
export function sumAnswers(answers: QuizAnswer[]): number {
  return answers.reduce((sum, a) => sum + a.score, 0);
}

// ---------------------------------------------------------------------------
// Stage 1 result tiers — from quiz_questionnaire.md
// Score range 0–16
// ---------------------------------------------------------------------------

export function getStage1Tier(score: number): StageTier {
  if (score >= 11) return "HIGH_REACTIVITY";
  if (score >= 6)  return "MODERATE_SENSITIVITY";
  if (score >= 3)  return "LOW_SENSITIVITY";
  return "LOW_RELEVANCE";
}

export function getStage1Result(score: number): StageResult {
  const tier = getStage1Tier(score);

  switch (tier) {
    case "HIGH_REACTIVITY":
      return {
        stage: 1,
        score,
        tier,
        resultText:
          "Your responses show a strong reactive and high-sensitivity skin pattern, especially in response to ingredients and textures.",
        primaryCta: "Continue to full skin tolerance assessment",
        primaryCtaHref: "/quiz/stage-2",
      };

    case "MODERATE_SENSITIVITY":
      return {
        stage: 1,
        score,
        tier,
        resultText:
          "Your responses show moderate sensitivity in skin response and product tolerance.",
        primaryCta: "Take full skin tolerance assessment",
        primaryCtaHref: "/quiz/stage-2",
        secondaryCta: "Join updates",
        secondaryCtaHref: "/#waitlist",
      };

    case "LOW_SENSITIVITY":
      return {
        stage: 1,
        score,
        tier,
        resultText:
          "Your skin shows occasional sensitivity or discomfort with certain products.",
        primaryCta: "Optional full assessment",
        primaryCtaHref: "/quiz/stage-2",
        secondaryCta: "Join updates",
        secondaryCtaHref: "/#waitlist",
      };

    case "LOW_RELEVANCE":
    default:
      return {
        stage: 1,
        score,
        tier,
        resultText:
          "Your responses suggest low skin reactivity or minimal product intolerance.",
        primaryCta: "Join updates",
        primaryCtaHref: "/#waitlist",
        secondaryCta: "Know someone with sensitive skin? Share this quiz",
        secondaryCtaHref: "/quiz",
      };
  }
}

// ---------------------------------------------------------------------------
// Stage 2 result tiers — from quiz_questionnaire.md
// Score range 0–22
// ---------------------------------------------------------------------------

export function getStage2Tier(score: number): StageTier {
  if (score >= 18) return "CORE_PMF";
  if (score >= 12) return "STRONG_FIT";
  if (score >= 6)  return "WEAK_FIT";
  return "LOW_RELEVANCE";
}

export function getStage2Result(score: number): StageResult {
  const tier = getStage2Tier(score);

  switch (tier) {
    case "CORE_PMF":
      return {
        stage: 2,
        score,
        tier,
        resultText:
          "Your responses indicate a high-reactivity, low-tolerance skin pattern.",
        primaryCta: "Join early access waitlist",
        primaryCtaHref: "/#waitlist",
        secondaryCta: "Get invited to our launch event",
        secondaryCtaHref: "/#waitlist",
      };

    case "STRONG_FIT":
      return {
        stage: 2,
        score,
        tier,
        resultText:
          "Your responses indicate moderate to high sensitivity in skin tolerance and product compatibility.",
        primaryCta: "Join waitlist",
        primaryCtaHref: "/#waitlist",
      };

    case "WEAK_FIT":
      return {
        stage: 2,
        score,
        tier,
        resultText:
          "Your responses show occasional sensitivity or product mismatch patterns.",
        primaryCta: "Join updates",
        primaryCtaHref: "/#waitlist",
        secondaryCta: "Optional waitlist entry",
        secondaryCtaHref: "/#waitlist",
      };

    case "LOW_RELEVANCE":
    default:
      return {
        stage: 2,
        score,
        tier,
        resultText:
          "Your responses suggest low sensitivity or stable skin tolerance patterns.",
        primaryCta: "Join updates",
        primaryCtaHref: "/#waitlist",
        secondaryCta: "Know someone with sensitive or reactive skin? Share this with them.",
        secondaryCtaHref: "/quiz",
      };
  }
}
