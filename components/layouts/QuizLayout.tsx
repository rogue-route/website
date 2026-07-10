/**
 * QuizLayout — structural shell for all quiz pages (/quiz, /quiz/stage-2,
 * /quiz/results).
 *
 * Shape:
 *   <div> (full-height flex column, True White background)
 *     <div>   ← progress bar slot (ProgressIndicator injected in Task 4.4)
 *     <main>  ← quiz page content (the floating card)
 *   </div>
 *
 * Key differences from MarketingLayout:
 * - No nav — the quiz is a focused, distraction-free flow. The spec says
 *   "no nav" explicitly.
 * - No footer — same reasoning; quiz pages are task-focused.
 * - True White background (#FFFFFF) instead of Chalk White — the quiz card
 *   floats on a clean white surface per the "premium, clinical" design brief.
 * - Progress bar sits in a fixed-height strip at the top so the card always
 *   appears at the same vertical position regardless of progress state.
 *
 * Why a fixed-height progress strip (h-12 / 48px)?
 * 48px gives the ProgressIndicator ("Question X of Y" + bar fill) enough
 * room at all breakpoints. Task 4.4 will fill this space with the real
 * component; the reserved height prevents layout shift when it renders.
 *
 * Why `items-start justify-center` on <main>?
 * The quiz card needs to be horizontally centred but sit near the top of
 * the visible area (not vertically centred) — centering vertically on a
 * phone looks odd when the keyboard is open.
 */

interface QuizLayoutProps {
  children: React.ReactNode;
  /** ProgressIndicator component — injected once Task 4.4 is complete. */
  progressBar?: React.ReactNode;
}

export function QuizLayout({ children, progressBar }: QuizLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-true-white">
      {/* ── Progress bar slot ─────────────────────────────────────────── */}
      {/* Fixed height strip reserves space so the card doesn't shift when
          the real ProgressIndicator is injected in Task 4.4.
          border-b uses Fog — the only allowed border color. */}
      <div className="h-12 w-full shrink-0 border-b border-fog">
        {progressBar ?? null}
      </div>

      {/* ── Quiz content ──────────────────────────────────────────────── */}
      {/* px-5 = 20px side padding (mobile spec from PROJECT.md).
          pt-10 gives breathing room between the progress bar and the card.
          max-w is handled by the QuizCard itself, not the layout. */}
      {/* id="main-content" is the skip-link target added in Task 5.1 */}
      <main id="main-content" className="flex flex-1 flex-col items-center px-5 pt-10 pb-16">
        {children}
      </main>
    </div>
  );
}
