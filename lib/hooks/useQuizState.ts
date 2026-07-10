/**
 * useQuizState — Task 4.2
 *
 * useReducer-based quiz state hook. Tracks:
 *   - Current question index within the active stage
 *   - All answers for Stage 1 and Stage 2
 *   - Active stage (1 or 2)
 *   - Whether the current stage is complete (score display phase)
 *
 * WHY useReducer instead of multiple useState:
 *   Multiple pieces of state that update together (e.g. advancing the index
 *   while storing an answer) need to be atomic. useReducer guarantees a single
 *   re-render per dispatch and makes state transitions explicit and testable.
 *
 * WHY context (not prop-drilling or URL params):
 *   The quiz spans three Next.js pages (/quiz, /quiz/stage-2, /quiz/results).
 *   Prop-drilling doesn't cross page boundaries. URL params would require
 *   encoding all answers in the URL (messy, length-limited). Context at the
 *   quiz layout level is clean and stays within React — no external store.
 *   This is still useReducer, not Zustand (AGENTS.md rule).
 *
 * This file exports the reducer, initial state, and action types.
 * The context and provider live in components/layouts/QuizProvider.tsx
 * (a "use client" component) so this file stays importable by both
 * client and server contexts without triggering the client boundary.
 */

import type { QuizAnswer, QuizStage } from "@/lib/quiz/types";
import {
  computeStage1QuestionScore,
  computeStage2QuestionScore,
} from "@/lib/quiz/scoring";
import { STAGE_1_QUESTIONS, STAGE_2_QUESTIONS } from "@/lib/quiz/questions";

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface QuizState {
  stage: QuizStage;
  /** Index of the currently displayed question within the active stage. */
  currentIndex: number;
  stage1Answers: QuizAnswer[];
  stage2Answers: QuizAnswer[];
  /**
   * When true, the current stage is finished and the ScoreDisplay is shown.
   * The user clicks a CTA to navigate to the next stage/results page.
   */
  stageComplete: boolean;
}

export const INITIAL_STATE: QuizState = {
  stage: 1,
  currentIndex: 0,
  stage1Answers: [],
  stage2Answers: [],
  stageComplete: false,
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type QuizAction =
  /**
   * Record an answer for the current question and advance to the next.
   * If this was the last question in the stage, sets stageComplete = true.
   */
  | {
      type: "ANSWER_QUESTION";
      questionId: string;
      selectedIds: string[];
    }
  /**
   * Advance to Stage 2. Called from the Stage 1 ScoreDisplay CTA.
   * Resets currentIndex to 0 and stageComplete to false.
   */
  | { type: "START_STAGE_2" }
  /** Reset everything — used if user wants to retake. */
  | { type: "RESET" };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "ANSWER_QUESTION": {
      const questions =
        state.stage === 1 ? STAGE_1_QUESTIONS : STAGE_2_QUESTIONS;

      const score =
        state.stage === 1
          ? computeStage1QuestionScore(action.questionId, action.selectedIds)
          : computeStage2QuestionScore(action.questionId, action.selectedIds);

      const answer: QuizAnswer = {
        questionId: action.questionId,
        selectedIds: action.selectedIds,
        score,
      };

      const isLastQuestion = state.currentIndex === questions.length - 1;

      if (state.stage === 1) {
        // Overwrite if already answered (user cannot go back in v1,
        // but this keeps the reducer safe if called twice).
        const existing = state.stage1Answers.findIndex(
          (a) => a.questionId === action.questionId
        );
        const stage1Answers =
          existing >= 0
            ? state.stage1Answers.map((a, i) => (i === existing ? answer : a))
            : [...state.stage1Answers, answer];

        return {
          ...state,
          stage1Answers,
          currentIndex: isLastQuestion ? state.currentIndex : state.currentIndex + 1,
          stageComplete: isLastQuestion,
        };
      } else {
        const existing = state.stage2Answers.findIndex(
          (a) => a.questionId === action.questionId
        );
        const stage2Answers =
          existing >= 0
            ? state.stage2Answers.map((a, i) => (i === existing ? answer : a))
            : [...state.stage2Answers, answer];

        return {
          ...state,
          stage2Answers,
          currentIndex: isLastQuestion ? state.currentIndex : state.currentIndex + 1,
          stageComplete: isLastQuestion,
        };
      }
    }

    case "START_STAGE_2":
      return {
        ...state,
        stage: 2,
        currentIndex: 0,
        stageComplete: false,
      };

    case "RESET":
      return INITIAL_STATE;

    default:
      return state;
  }
}
