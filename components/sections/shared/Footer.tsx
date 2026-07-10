/**
 * Footer — shared marketing footer (Task 1.2)
 *
 * Layout:
 *   Mobile  → single column, stacked sections
 *   Desktop → four columns: Brand | Navigate | Follow | Legal
 *
 * This is a Server Component — no interactivity, no hooks needed.
 * Owns its own <footer> landmark element (MarketingLayout renders the
 * slot as bare JSX, so the semantic element must live here).
 *
 * Social icon SVGs are inline — avoids importing lucide-react or any
 * icon library just for two icons (AGENTS.md: keep dependencies minimal).
 *
 * Policy links point to "#" — the policy pages are reserved for a future
 * phase. Task 2.5 will replace these with real URLs once pages exist.
 */

import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/quiz", label: "Skin Quiz" },
] as const;

const LEGAL_LINKS = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Use" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: (
      // Simple Instagram outline icon — 24×24 viewBox
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://tiktok.com",
    label: "TikTok",
    icon: (
      // Simple TikTok outline icon
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
] as const;

// Column heading style — reused across all four columns
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-4 text-xs font-medium tracking-[0.08em] uppercase text-ash"
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {children}
    </p>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-fog bg-chalk-white">
      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">

          {/* ── Column 1: Brand ──────────────────────────────────────── */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-light tracking-[0.06em] text-carbon transition-colors hover:text-forest-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              RogueRoute
            </Link>
            <p
              className="mt-3 text-sm leading-relaxed text-ash"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Skincare formulated to go rogue.
              <br />
              Evidence-based. Transparent. Minimal.
            </p>
          </div>

          {/* ── Column 2: Navigate ───────────────────────────────────── */}
          <div>
            <ColHeading>Navigate</ColHeading>
            <ul className="space-y-3" role="list">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ash transition-colors hover:text-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Follow ─────────────────────────────────────── */}
          <div>
            <ColHeading>Follow</ColHeading>
            <ul className="space-y-3" role="list">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in new tab)`}
                    className="inline-flex items-center gap-2 text-sm text-ash transition-colors hover:text-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {icon}
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Legal ──────────────────────────────────────── */}
          <div>
            <ColHeading>Legal</ColHeading>
            <ul className="space-y-3" role="list">
              {LEGAL_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-ash transition-colors hover:text-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar: copyright ────────────────────────────────────────── */}
      <div className="border-t border-fog">
        <div className="mx-auto max-w-[1200px] px-5 py-4">
          <p
            className="text-xs text-ash"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            © {year} RogueRoute. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
