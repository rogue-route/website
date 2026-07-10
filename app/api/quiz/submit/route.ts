/**
 * Quiz submit API — Task 6.2
 *
 * Validates the full quiz submission payload and inserts it into the
 * Supabase `quiz_responses` table. Falls back to console.log if
 * SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.
 *
 * Table schema (create once in Supabase SQL editor — see TASK.md note):
 *
 *   create table quiz_responses (
 *     id          uuid primary key default gen_random_uuid(),
 *     stage1_answers  jsonb not null,
 *     stage1_score    integer not null,
 *     stage1_tier     text not null,
 *     stage2_answers  jsonb not null,
 *     stage2_score    integer not null,
 *     stage2_tier     text not null,
 *     email           text,
 *     submitted_at    timestamptz not null
 *   );
 *
 * WHY service role key (not anon key):
 *   This is a server-side API route — the key never reaches the browser.
 *   The service role key bypasses Row Level Security, which is correct here
 *   because we want all submissions stored regardless of auth state.
 *   Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
 */
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Supabase client — only created when env vars are present
// ---------------------------------------------------------------------------

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// Zod schema — unchanged from Task 4.8
// ---------------------------------------------------------------------------

const quizAnswerSchema = z.object({
  questionId: z.string(),
  selectedIds: z.array(z.string()),
  score: z.number(),
});

const submissionSchema = z.object({
  stage1Answers: z.array(quizAnswerSchema),
  stage1Score: z.number(),
  stage1Tier: z.string(),
  stage2Answers: z.array(quizAnswerSchema),
  stage2Score: z.number(),
  stage2Tier: z.string(),
  email: z.string().email().optional(),
  submittedAt: z.string(),
});

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

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

    const data = result.data;
    const supabase = getSupabase();

    if (supabase) {
      const { error } = await supabase.from("quiz_responses").insert({
        stage1_answers:  data.stage1Answers,
        stage1_score:    data.stage1Score,
        stage1_tier:     data.stage1Tier,
        stage2_answers:  data.stage2Answers,
        stage2_score:    data.stage2Score,
        stage2_tier:     data.stage2Tier,
        email:           data.email ?? null,
        submitted_at:    data.submittedAt,
      });

      if (error) {
        console.error("[quiz/submit] Supabase insert error:", error.message);
        // Return ok: true anyway — don’t block the user over a storage failure
      } else {
        console.log("[quiz/submit] stored to Supabase, tier:", data.stage2Tier);
      }
    } else {
      // Dev fallback: no Supabase credentials configured
      console.log("[quiz/submit] (Supabase not configured):", JSON.stringify(data, null, 2));
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[quiz/submit] error:", err);
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
