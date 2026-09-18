/**
 * Anonymous quiz submission API.
 *
 * Validates every question and selected option against the questionnaire,
 * recomputes both scores server-side, and stores the answers using the exact
 * column names of the existing public.quiz_responses table.
 */
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { STAGE_1_QUESTIONS, STAGE_2_QUESTIONS } from "@/lib/quiz/questions";
import {
  computeStage1QuestionScore,
  computeStage2QuestionScore,
} from "@/lib/quiz/scoring";
import type { Question } from "@/lib/quiz/types";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const quizAnswerSchema = z.object({
  questionId: z.string(),
  selectedIds: z.array(z.string()).min(1).max(9),
  score: z.number(),
});

const submissionSchema = z
  .object({
    stage1Answers: z.array(quizAnswerSchema).length(STAGE_1_QUESTIONS.length),
    stage1Score: z.number(),
    stage1Tier: z.string(),
    stage2Answers: z.array(quizAnswerSchema).length(STAGE_2_QUESTIONS.length),
    stage2Score: z.number(),
    stage2Tier: z.string(),
    submittedAt: z.string(),
  })
  .strict();

type SubmittedAnswer = z.infer<typeof quizAnswerSchema>;

type ValidatedAnswer = {
  questionId: string;
  selectedIds: string[];
  score: number;
};

function validateAndOrderAnswers(
  answers: SubmittedAnswer[],
  questions: Question[],
  stage: 1 | 2
): ValidatedAnswer[] | null {
  const answersByQuestion = new Map(
    answers.map((answer) => [answer.questionId, answer])
  );

  if (answersByQuestion.size !== answers.length) return null;

  const orderedAnswers: ValidatedAnswer[] = [];

  for (const question of questions) {
    const answer = answersByQuestion.get(question.id);
    if (!answer) return null;

    const validOptionIds = new Set(question.options.map((option) => option.id));
    if (answer.selectedIds.some((id) => !validOptionIds.has(id))) return null;
    if (new Set(answer.selectedIds).size !== answer.selectedIds.length) return null;
    if (question.type === "single" && answer.selectedIds.length !== 1) return null;

    const noneSelected = question.options.some(
      (option) => option.isNoneOption && answer.selectedIds.includes(option.id)
    );
    if (noneSelected && answer.selectedIds.length !== 1) return null;

    const score =
      stage === 1
        ? computeStage1QuestionScore(question.id, answer.selectedIds)
        : computeStage2QuestionScore(question.id, answer.selectedIds);

    orderedAnswers.push({
      questionId: question.id,
      selectedIds: answer.selectedIds,
      score,
    });
  }

  return orderedAnswers;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = submissionSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { ok: false, error: result.error.issues[0]?.message ?? "Invalid submission." },
        { status: 400 }
      );
    }

    const stage1Answers = validateAndOrderAnswers(
      result.data.stage1Answers,
      STAGE_1_QUESTIONS,
      1
    );
    const stage2Answers = validateAndOrderAnswers(
      result.data.stage2Answers,
      STAGE_2_QUESTIONS,
      2
    );

    if (!stage1Answers || !stage2Answers) {
      return Response.json(
        { ok: false, error: "Invalid questionnaire answers." },
        { status: 400 }
      );
    }

    console.log("[quiz/submit] Supabase env check:", {
    hasUrl: Boolean(process.env.SUPABASE_URL),
    hasKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  });

    const supabase = getSupabase();
    if (!supabase) {
      console.error("[quiz/submit] Supabase configuration is missing.");
      return Response.json(
        { ok: false, error: "Questionnaire storage is unavailable." },
        { status: 503 }
      );
    }

    const stage1Score = stage1Answers.reduce(
      (total, answer) => total + answer.score,
      0
    );
    const stage2Score = stage2Answers.reduce(
      (total, answer) => total + answer.score,
      0
    );
    const stage2Responses = stage2Answers.map((answer, index) =>
      STAGE_2_QUESTIONS[index].options.find(
        (option) => option.id === answer.selectedIds[0]
      )!.label
    );

    const { error } = await supabase.from("quiz_responses").insert({
      Stage1Q1: stage1Answers[0],
      Stage1Q2: stage1Answers[1],
      Stage1Result: stage1Score,
      Stage2Q1: stage2Responses[0],
      Stage2Q2: stage2Responses[1],
      Stage2Q3: stage2Responses[2],
      Stage2Q4: stage2Responses[3],
      Stage2Q5: stage2Responses[4],
      Stage2Q6: stage2Responses[5],
      Stage2Q7: stage2Responses[6],
      Stage2Q8: stage2Responses[7],
      Stage2Q9: stage2Responses[8],
      Stage2Q10: stage2Responses[9],
      Stage2Q11: stage2Responses[10],
      Stage2Result: stage2Score,
    });

    if (error) {
      console.error("[quiz/submit] Supabase insert failed.", {
        code: error.code,
      });
      return Response.json(
        { ok: false, error: "Questionnaire submission failed." },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch {
    console.error("[quiz/submit] Unexpected server error.");
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

