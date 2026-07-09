/**
 * app/(quiz)/layout.tsx
 * Next.js App Router layout for the quiz route group.
 *
 * Delegates structure to the QuizLayout component.
 * The progressBar slot is empty for now — Task 4.4 will inject the real
 * ProgressIndicator without changing this file.
 */
import { QuizLayout } from "@/components/layouts/QuizLayout";

export default function QuizRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // progressBar prop intentionally omitted — built in Task 4.4
  return <QuizLayout>{children}</QuizLayout>;
}
