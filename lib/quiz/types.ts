/**
 * Quiz types — Task 4.1
 *
 * All types used across the quiz data layer, state hook, and UI components
 * are defined here so they can be imported from a single location.
 */

// ---------------------------------------------------------------------------
// Question model
// ---------------------------------------------------------------------------

/** A single selectable option within a question. */
export interface QuizOption {
  /** Unique stable key within the question. */
  id: string;
  /** Display text shown to the user. */
  label: string;
  /** Points awarded when this option is selected. */
  score: number;
  /**
   * If true, selecting this option clears all other selections and sets the
   * question score to 0. Used for "None of the above" / "I don't avoid anything".
   */
  isNoneOption?: boolean;
}

/**
 * Single-select: user picks exactly one option (Yes / Sometimes / No).
 * Multi-select: user checks all that apply.
 */
export type QuestionType = "single" | "multi";

export interface Question {
  id: string;
  /** Human-readable question number within its stage, e.g. "Q1". */
  number: string;
  text: string;
  type: QuestionType;
  options: QuizOption[];
}

// ---------------------------------------------------------------------------
// Answer model
// ---------------------------------------------------------------------------

/**
 * The answer stored for a single question.
 * selectedIds is an array to support both single and multi-select questions
 * uniformly — for single-select it will always have 0 or 1 entries.
 */
export interface QuizAnswer {
  questionId: string;
  selectedIds: string[];
  /** Pre-computed score for this answer, stored at selection time. */
  score: number;
}

// ---------------------------------------------------------------------------
// Stage model
// ---------------------------------------------------------------------------

export type QuizStage = 1 | 2;

/**
 * Tier labels derived from final scores, matching quiz_questionnaire.md.
 * Stage 1 tiers: HIGH_REACTIVITY | MODERATE_SENSITIVITY | LOW_SENSITIVITY | LOW_RELEVANCE
 * Stage 2 tiers: CORE_PMF | STRONG_FIT | WEAK_FIT | LOW_RELEVANCE
 */
export type StageTier =
  | "HIGH_REACTIVITY"
  | "MODERATE_SENSITIVITY"
  | "LOW_SENSITIVITY"
  | "LOW_RELEVANCE"
  | "CORE_PMF"
  | "STRONG_FIT"
  | "WEAK_FIT";

export interface StageResult {
  stage: QuizStage;
  score: number;
  tier: StageTier;
  /** Result text shown to the user, from quiz_questionnaire.md. */
  resultText: string;
  /** Primary CTA label. */
  primaryCta: string;
  /** Primary CTA href. */
  primaryCtaHref: string;
  /** Optional secondary CTA label. */
  secondaryCta?: string;
  /** Optional secondary CTA href. */
  secondaryCtaHref?: string;
}

// ---------------------------------------------------------------------------
// Full quiz submission payload (sent to /api/quiz/submit)
// ---------------------------------------------------------------------------

export interface QuizSubmission {
  stage1Answers: QuizAnswer[];
  stage1Score: number;
  stage1Tier: StageTier;
  stage2Answers: QuizAnswer[];
  stage2Score: number;
  stage2Tier: StageTier;
  /** Captured at submission time if user provided email on results page. */
  email?: string;
  submittedAt: string; // ISO 8601
}
