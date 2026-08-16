/**
 * Footer — shared marketing footer (Task 1.2)
 *
 * Desktop (md+) layout: TWO columns.
 *   Column 1 (auto-width) → logo | divider | "Go Rogue" image, with the
 *                            tagline underneath.
 *   Column 2 (fills remaining space) → the footer menu (Navigate / Follow
 *                            / Legal), laid out as its own row of columns.
 *
 *   Column 1 is sized with `auto` (shrink-to-fit its content) and column 2
 *   with `1fr` (takes whatever's left). That means growing the logo or the
 *   Go Rogue image — e.g. by bumping LOGO_SIZE_CLASS — widens column 1
 *   automatically, which shrinks column 2's available space in response.
 *   No manual width tuning needed on either side.
 *
 *   The menu itself is data-driven: FOOTER_MENU_SECTIONS is an array, and
 *   its column count is read off `.length` into a CSS variable, so adding
 *   a new section (e.g. "Products") to that array adds a new menu column
 *   automatically — no JSX/grid edits required.
 *
 * Mobile layout: unchanged — everything stacks in document order (top
 * row, tagline, then each menu section full-width), since the two-column
 * split above only kicks in at the `md` breakpoint.
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
    href: "https://youtube.com",
    label: "YouTube",
    icon: (
      // Simple YouTube-style outline icon — rounded rect + play triangle
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
        <rect x="2" y="5" width="20" height="14" rx="4" ry="4" />
        <path d="M10 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
] as const;

// ── Footer menu, as data ───────────────────────────────────────────────
// Each entry becomes one column in the desktop menu grid (and one
// full-width stacked section on mobile). To add a new column — e.g. a
// future "Products" section — just add another entry here; the grid
// below reads its column count from this array's length automatically.
type FooterMenuSection =
  | { title: string; type: "links"; items: readonly { href: string; label: string }[] }
  | {
      title: string;
      type: "social";
      items: readonly { href: string; label: string; icon: React.ReactNode }[];
    };

const FOOTER_MENU_SECTIONS: readonly FooterMenuSection[] = [
  { title: "Navigate", type: "links", items: NAV_LINKS },
  { title: "Follow", type: "social", items: SOCIAL_LINKS },
  { title: "Legal", type: "links", items: LEGAL_LINKS },
];

// Column heading style — reused across all menu columns
function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-4 font-medium tracking-[0.08em] uppercase text-ash"
      style={{ fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: "clamp(12px, 1.5vw, 18px)",
            }}
    >
      {children}
    </p>
  );
}

const LOGO_SRC = "/images/rogueroute-logo.svg";
const GO_ROGUE_SRC = "/images/go_rogue.png";

// Shared fluid size for the logo and the "Go Rogue" image, and the
// divider between them — keeps all three in sync as the viewport scales
// instead of jumping at fixed breakpoints.
// 36px at the smallest screens, up to 56px at wide desktop.
// Bumping the max (3.5rem) here is what grows column 1 — see file header.
const LOGO_SIZE_CLASS = "h-[clamp(4.25rem,1.6rem+6.5vw,12.5rem)]";

// Static footer wordmark — masks the logo svg over a solid color span.
// No scroll-based color swap (Footer is a Server Component); always
// ash-toned. Swap bg-ash → bg-carbon if you want it darker.
// drop-shadow (not box-shadow) so the shadow follows the masked logo
// shape instead of its rectangular bounding box.
function FooterLogo() {
  return (
    <span
      role="img"
      aria-label="RogueRoute"
      className={`inline-block bg-black drop-shadow-md ${LOGO_SIZE_CLASS}`}
      style={{
        aspectRatio: "1.6",
        // transform: "translateY(-38px)",
        WebkitMaskImage: `url(${LOGO_SRC})`,
        maskImage: `url(${LOGO_SRC})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
      }}
    />
  );
}

// "Go Rogue" is a PNG (not a single-tone SVG), so it renders as a plain
// <img> rather than through the mask technique above — drop-shadow still
// applies and follows the PNG's alpha channel if it has a transparent
// background.
function GoRogueImage() {
  return (
    <img
      src={GO_ROGUE_SRC}
      alt="Go Rogue"
      className={`w-auto drop-shadow-md ${LOGO_SIZE_CLASS}`}
      style={{ transform: "translateX(-2.25em)" }}
    />
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-fog bg-chalk-white">
      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:py-20"
      style={{transform: "translateY(-2.5em)"}}>

        {/* ── Two-column split (desktop only — plain stack on mobile) ──
              Column 1: auto-width, sized to its own content (logo/divider/
              Go-Rogue row + tagline). Column 2: 1fr, takes what's left,
              holding the menu. Grow column 1's content and column 2
              shrinks to match — no fixed widths on either side. */}
        <div className="md:grid md:grid-cols-[auto_1fr] md:items-start md:gap-16">

          {/* ── Column 1: logo | divider | Go Rogue, tagline below ────── */}
          <div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                aria-label="RogueRoute — Home"
                className="inline-block transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
              >
                <FooterLogo />
              </Link>
              <div
                className={`w-px bg-fog ${LOGO_SIZE_CLASS}`}
                aria-hidden="true"
              />
              <GoRogueImage />
            </div>

            {/* Currently wraps naturally; swap to explicit <br /> line
                breaks here if you decide you want forced breaks instead. */}
            <p
              className="mt-4 max-w-md text-sm leading-relaxed text-ash"
              style={{ fontFamily: "var(--font-dm-sans)",
                       fontWeight: 500,
                       fontSize: "clamp(12px, 1.5vw, 16px)",}}
            >
              For Ultra sensitive skin. Minimal ingredient formulations. <br/>
              Barrier best friend.
            </p>
          </div>

          {/* ── Column 2: the menu — column count driven by
                FOOTER_MENU_SECTIONS.length via --menu-cols. Mobile stays
                grid-cols-1 (stacked); md+ switches to that many columns. ── */}
          <div
            className="mt-12 grid grid-cols-1 gap-12 md:mt-0 md:grid-cols-[var(--menu-cols)] md:gap-8"
            style={
              {
                "--menu-cols": `repeat(${FOOTER_MENU_SECTIONS.length}, minmax(0, 1fr))`,
              } as React.CSSProperties
            }
          >
            {FOOTER_MENU_SECTIONS.map((section) => (
              <div key={section.title}>
                <ColHeading>{section.title}</ColHeading>
                <ul className="space-y-3" role="list">
                  {section.type === "social"
                    ? section.items.map(({ href, label, icon }) => (
                        <li key={label}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${label} (opens in new tab)`}
                            className="inline-flex items-center gap-2 text-sm text-ash transition-colors hover:text-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
                            style={{ fontFamily: "var(--font-dm-sans)",
                                      fontWeight: 500,
                                      fontSize: "clamp(12px, 1.5vw, 18px)",
                                    }}
                          >
                            {icon}
                            {label}
                          </a>
                        </li>
                      ))
                    : section.items.map(({ href, label }) => (
                        <li key={label}>
                          <Link
                            href={href}
                            className="text-sm text-ash transition-colors hover:text-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
                            style={{ fontFamily: "var(--font-dm-sans)",
                                      fontWeight: 500,
                                      fontSize: "clamp(12px, 1.5vw, 18px)", 
                                    }}
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Bottom bar: copyright ────────────────────────────────────────── */}
      <div className="border-t border-fog bg-forest-ink">
        <div className="mx-auto max-w-[1200px] 
        px-5 py-2 md:py-4 flex justify-center items-center text-center">
          <p
            className="text-white"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "clamp(10px, 1.5vw, 14px)" }}
          >
            © {year} RogueRoute. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}