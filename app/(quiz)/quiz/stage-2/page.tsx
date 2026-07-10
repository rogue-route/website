/**
 * Quiz Stage 2 page — Task 4.7
 *
 * Same pattern as Stage 1. Reads state from QuizContext.
 * Shows 11 single-select questions then ScoreDisplay.
 * "use client" because it reads from QuizContext.
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/components/layouts/QuizProvider";
import { QuizCard } from "@/components/compounds/quiz/QuizCard";
import { ScoreDisplay } from "@/components/compounds/quiz/ScoreDisplay";
import { STAGE_2_QUESTIONS } from "@/lib/quiz/questions";
import { getStage2Result, sumAnswers } from "@/lib/quiz/scoring";

export default function QuizStage2Page() {
  const { state, dispatch } = useQuiz();
  const router = useRouter();

  // Guard: if Stage 1 is not complete, send user back to start.
  // This handles direct URL navigation or hard refresh.
  useEffect(() => {
    if (state.stage1Answers.length === 0) {
      router.replace("/quiz");
    }
  }, [state.stage1Answers.length, router]);

  const currentQuestion = STAGE_2_QUESTIONS[state.currentIndex];

  function handleConfirm(selectedIds: string[]) {
    if (!currentQuestion) return;
    dispatch({
      type: "ANSWER_QUESTION",
      questionId: currentQuestion.id,
      selectedIds,
    });
  }

  // Stage 2 complete — show score, CTA leads to /quiz/results
  if (state.stageComplete && state.stage === 2) {
    const score = sumAnswers(state.stage2Answers);
    const result = getStage2Result(score);
    // Override primaryCtaHref to go to results page
    const resultWithNav = {
      ...result,
      primaryCta: "See your full results",
      primaryCtaHref: "/quiz/results",
    };
    return <ScoreDisplay result={resultWithNav} />;
  }

  // Stage 1 guard: if still on stage 1, return null (redirect in useEffect)
  if (state.stage === 1) return null;

  if (!currentQuestion) return null;

  // Visually-hidden h1 gives the page a document title landmark for
  // screen readers. The question text uses h2 inside the card.
  return (
    <>
      <h1 className="sr-only">Skin Quiz — Stage 2</h1>
      <QuizCard
        question={currentQuestion}
        onConfirm={handleConfirm}
      />
    </>
  );
}
