"use client";
/**
 * ProgressIndicator — Task 4.4
 *
 * "Question X of Y" counter + filled progress bar.
 * Rendered inside the QuizLayout progress strip (h-12 / 48px).
 *
 * Reads from QuizContext so it always reflects current state without
 * needing props threaded through the layout.
 *
 * When stageComplete is true, shows "Complete" and a full bar.
 * On /quiz/results the stage is 2 and stageComplete is true, so the
 * bar shows 100%.
 *
 * Typography: DM Mono — "Data/scores/progress" font per PROJECT.md § 3.
 * Bar fill: Forest Ink (the only CTA/primary colour per PROJECT.md § 3).
 * Bar track: Fog (the only border/divider colour per PROJECT.md § 3).
 * Max 3 colours per section rule: Carbon, Forest Ink, Fog ✓
 *
 * Why "use client": reads from QuizContext which requires useContext.
 */

import { useQuiz } from "@/components/layouts/QuizProvider";
import { STAGE_1_QUESTIONS, STAGE_2_QUESTIONS } from "@/lib/quiz/questions";

export function ProgressIndicator() {
  const { state } = useQuiz();
  const { stage, currentIndex, stageComplete } = state;

  const questions = stage === 1 ? STAGE_1_QUESTIONS : STAGE_2_QUESTIONS;
  const total = questions.length;

  // current question number (1-based); full when stageComplete
  const current = stageComplete ? total : currentIndex + 1;
  const progressPct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex h-full w-full items-center gap-4 px-5 md:px-10">
      {/* "Stage X · Q Y of Z" label — DM Mono */}
      <p
        className="shrink-0 text-xs text-ash"
        style={{
          fontFamily: "var(--font-dm-mono)",
          fontWeight: 400,
          letterSpacing: "0.06em",
        }}
        aria-label={`Stage ${stage}, question ${current} of ${total}`}
      >
        <span aria-hidden="true">
          {stageComplete
            ? `Stage ${stage} · Complete`
            : `Stage ${stage} · ${current} / ${total}`}
        </span>
      </p>

      {/* Progress bar */}
      <div
        className="h-1 flex-1 overflow-hidden rounded-full bg-fog"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${progressPct}% complete`}
      >
        <div
          className="h-full rounded-full bg-forest-ink transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
