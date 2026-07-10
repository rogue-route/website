/**
 * MarketingLayout — structural shell for the landing and about pages.
 *
 * Shape:
 *   <div> (full-height flex column)
 *     <header>  ← nav slot (NavBar injected in Task 1.1)
 *     <main>    ← page content
 *     <footer>  ← footer slot (Footer injected in Task 1.2)
 *   </div>
 *
 * Why props instead of hard-coded imports?
 * NavBar and Footer don't exist yet (Tasks 1.1 & 1.2). Accepting them as
 * optional props means those tasks can inject the real components without
 * touching this file. The layout structure — flex column, sticky header,
 * footer at bottom — is established now and stays stable.
 *
 * Why a wrapping <div> rather than <body>?
 * Next.js App Router owns <body> in app/layout.tsx. This component is a
 * regular React component that renders inside <body>.
 *
 * The `min-h-screen flex flex-col` pattern ensures the footer is always
 * pushed to the bottom even on short pages — important for the "Launching
 * Soon" landing page which won't have much content initially.
 */

interface MarketingLayoutProps {
  children: React.ReactNode;
  /** NavBar component — injected once Task 1.1 is complete. */
  nav?: React.ReactNode;
  /** Footer component — injected once Task 1.2 is complete. */
  footer?: React.ReactNode;
}

export function MarketingLayout({
  children,
  nav,
  footer,
}: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-chalk-white">
      {/* ── Header / Nav slot ─────────────────────────────────────────── */}
      {/* Renders nothing until NavBar is injected in Task 1.1.
          The <header> element is always present for correct landmark
          semantics — screen readers expect one <header> per page. */}
      <header className="w-full">{nav ?? null}</header>

      {/* ── Page content ──────────────────────────────────────────────── */}
      {/* flex-1 pushes the footer to the bottom regardless of content height */}
      {/* id="main-content" is the skip-link target added in Task 5.1 */}
      <main id="main-content" className="flex-1">{children}</main>

      {/* ── Footer slot ───────────────────────────────────────────────── */}
      {footer ?? null}
    </div>
  );
}
