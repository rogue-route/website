/**
 * Quiz Stage 1 page — Task 4.5
 *
 * Wires QuizCard + ScoreDisplay to quiz state.
 * Shows questions one at a time; when all answered, shows ScoreDisplay.
 * "use client" because it reads from QuizContext via useQuiz().
 */
"use client";

import { useQuiz } from "@/components/layouts/QuizProvider";
import { QuizCard } from "@/components/compounds/quiz/QuizCard";
import { ScoreDisplay } from "@/components/compounds/quiz/ScoreDisplay";
import { STAGE_1_QUESTIONS } from "@/lib/quiz/questions";
import { getStage1Result, sumAnswers } from "@/lib/quiz/scoring";

export default function QuizStage1Page() {
  const { state, dispatch } = useQuiz();

  // If the user lands here mid-session on Stage 2, redirect them forward.
  // (Handles browser back-button edge case.)
  if (state.stage === 2 && !state.stageComplete) {
    return null; // layout still renders; user is on wrong page
  }

  const currentQuestion = STAGE_1_QUESTIONS[state.currentIndex];

  function handleConfirm(selectedIds: string[]) {
    if (!currentQuestion) return;
    dispatch({
      type: "ANSWER_QUESTION",
      questionId: currentQuestion.id,
      selectedIds,
    });
  }

  // Stage complete — show score
  if (state.stageComplete && state.stage === 1) {
    const score = sumAnswers(state.stage1Answers);
    const result = getStage1Result(score);
    return <ScoreDisplay result={result} onContinue={() => dispatch({ type: "START_STAGE_2" })} />;
  }

  if (!currentQuestion) return null;

  // Visually-hidden h1 gives the page a document title landmark for
  // screen readers. The question text uses h2 inside the card (correct
  // heading hierarchy under this h1).
  return (
    <>
      <h1 className="sr-only">Skin Quiz — Stage 1</h1>
      <QuizCard
        question={currentQuestion}
        onConfirm={handleConfirm}
      />
    </>
  );
}
