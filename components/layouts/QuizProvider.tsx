"use client";
/**
 * QuizProvider — Task 4.2
 *
 * React context + useReducer provider for quiz state.
 * Wraps all quiz pages so state persists across /quiz → /quiz/stage-2 →
 * /quiz/results without external storage or URL params.
 *
 * WHY "use client":
 *   useReducer and createContext require a client component. The quiz layout
 *   (app/(quiz)/layout.tsx) is a Server Component, so this provider is
 *   inserted as a client boundary between the layout and its children.
 *   Children that are Server Components remain server-rendered — Next.js only
 *   renders the provider itself on the client; it doesn't force children to
 *   become client components unless they use context directly.
 *
 * WHY a separate file from useQuizState.ts:
 *   useQuizState.ts must be importable anywhere (including server-side scoring
 *   utilities). Keeping "use client" in a separate file prevents the client
 *   directive from accidentally propagating to the data layer.
 */

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  quizReducer,
  INITIAL_STATE,
  type QuizState,
  type QuizAction,
} from "@/lib/hooks/useQuizState";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface QuizContextValue {
  state: QuizState;
  dispatch: Dispatch<QuizAction>;
}

const QuizContext = createContext<QuizContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, INITIAL_STATE);
  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook — consumed by quiz page components
// ---------------------------------------------------------------------------

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return ctx;
}
