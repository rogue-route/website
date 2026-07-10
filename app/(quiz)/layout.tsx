/**
 * app/(quiz)/layout.tsx
 * Next.js App Router layout for the quiz route group.
 *
 * Wraps all quiz pages in QuizProvider so state persists across
 * /quiz → /quiz/stage-2 → /quiz/results (Task 4.2).
 * ProgressIndicator injected into the progress bar slot (Task 4.4).
 */
import { QuizLayout } from "@/components/layouts/QuizLayout";
import { QuizProvider } from "@/components/layouts/QuizProvider";
import { ProgressIndicator } from "@/components/compounds/quiz/ProgressIndicator";

export default function QuizRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuizProvider>
      <QuizLayout progressBar={<ProgressIndicator />}>
        {children}
      </QuizLayout>
    </QuizProvider>
  );
}
