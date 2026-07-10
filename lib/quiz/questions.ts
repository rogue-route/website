/**
 * Quiz questions — Task 4.1
 *
 * Faithfully encodes every question, option, and score weight from
 * quiz_questionnaire.md. Do not change scores or question content here
 * without also updating scoring.ts and the questionnaire source document.
 *
 * Stage 1: 2 multi-select questions (Skin Tolerance Micro-Assessment).
 * Stage 2: 11 single-select questions (Full Skin Tolerance Assessment).
 *          Each option is Yes=2 / Sometimes=1 / No=0 per the spec.
 */

import type { Question } from "./types";

// ---------------------------------------------------------------------------
// Stage 1 — Skin Tolerance Micro-Assessment (2 questions, multi-select)
// ---------------------------------------------------------------------------

export const STAGE_1_QUESTIONS: Question[] = [
  {
    id: "s1q1",
    number: "Q1",
    text: "Do you experience any of the following skin issues? Check all that apply.",
    type: "multi",
    options: [
      { id: "s1q1_dryness",       label: "Dryness or tight skin",                   score: 1 },
      { id: "s1q1_redness",       label: "Redness",                                  score: 1 },
      { id: "s1q1_stinging",      label: "Stinging or burning sensation",             score: 2 },
      { id: "s1q1_itching",       label: "Itching",                                  score: 1 },
      { id: "s1q1_flakiness",     label: "Flakiness / dry patches",                  score: 1 },
      { id: "s1q1_flareups",      label: "Flare-ups or sudden reactions",             score: 2 },
      { id: "s1q1_unpredictable", label: "Skin reacts unpredictably to products",    score: 2 },
      { id: "s1q1_none",          label: "None of the above",                        score: 0, isNoneOption: true },
    ],
  },
  {
    id: "s1q2",
    number: "Q2",
    text: "Which of the following apply to your skincare experience? Check all that apply.",
    type: "multi",
    options: [
      { id: "s1q2_fragrance",     label: "Fragranced products irritate my skin",                                     score: 2 },
      { id: "s1q2_heavycreams",   label: "Heavy creams / balms feel uncomfortable",                                  score: 1 },
      { id: "s1q2_petrolatum",    label: "Petrolatum / Vaseline / mineral oil doesn't suit me",                      score: 2 },
      { id: "s1q2_waterbased",    label: "Water-based gels or creams sometimes sting my skin",                       score: 3 },
      { id: "s1q2_plainwater",    label: "Even plain water can sometimes sting or feel uncomfortable",               score: 3 },
      { id: "s1q2_longlist",      label: "I avoid long ingredient lists",                                            score: 1 },
      { id: "s1q2_oils",          label: "Oils or butters don't suit my skin",                                       score: 1 },
      { id: "s1q2_animal",        label: "Animal-derived ingredients (lanolin, beeswax, tallow, snail mucin) I avoid", score: 1 },
      { id: "s1q2_none",          label: "I don't avoid anything",                                                   score: 0, isNoneOption: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Stage 2 — Full Skin Tolerance Assessment (11 questions, single-select)
// All questions share the same Yes=2 / Sometimes=1 / No=0 option set.
// ---------------------------------------------------------------------------

function makeSingleOptions(questionId: string) {
  return [
    { id: `${questionId}_yes`,       label: "Yes",       score: 2 },
    { id: `${questionId}_sometimes`, label: "Sometimes", score: 1 },
    { id: `${questionId}_no`,        label: "No",        score: 0 },
  ];
}

export const STAGE_2_QUESTIONS: Question[] = [
  {
    id: "s2q1",
    number: "Q1",
    text: "Do skincare products ever sting or burn your skin?",
    type: "single",
    options: makeSingleOptions("s2q1"),
  },
  {
    id: "s2q2",
    number: "Q2",
    text: "Does even plain water sometimes sting or irritate your skin?",
    type: "single",
    options: makeSingleOptions("s2q2"),
  },
  {
    id: "s2q3",
    number: "Q3",
    text: "Do you often find skincare products unsuitable for your skin?",
    type: "single",
    options: makeSingleOptions("s2q3"),
  },
  {
    id: "s2q4",
    number: "Q4",
    text: "Do you avoid products with long ingredient lists?",
    type: "single",
    options: makeSingleOptions("s2q4"),
  },
  {
    id: "s2q5",
    number: "Q5",
    text: "Do fragranced skincare products irritate your skin?",
    type: "single",
    options: makeSingleOptions("s2q5"),
  },
  {
    id: "s2q6",
    number: "Q6",
    text: "Do you avoid heavy creams or thick balms?",
    type: "single",
    options: makeSingleOptions("s2q6"),
  },
  {
    id: "s2q7",
    number: "Q7",
    text: "Do petrolatum-based products (like Vaseline or mineral oil) not suit your skin?",
    type: "single",
    options: makeSingleOptions("s2q7"),
  },
  {
    id: "s2q8",
    number: "Q8",
    text: "Do plant oils or butters sometimes feel too heavy or unsuitable?",
    type: "single",
    options: makeSingleOptions("s2q8"),
  },
  {
    id: "s2q9",
    number: "Q9",
    text: "Do you avoid ingredients like lanolin, beeswax, tallow, or snail mucin?",
    type: "single",
    options: makeSingleOptions("s2q9"),
  },
  {
    id: "s2q10",
    number: "Q10",
    text: "Do you regularly experience dryness, redness, itching, flakiness, or flare-ups?",
    type: "single",
    options: makeSingleOptions("s2q10"),
  },
  {
    id: "s2q11",
    number: "Q11",
    text: "Does your skin react unpredictably to skincare products?",
    type: "single",
    options: makeSingleOptions("s2q11"),
  },
];
