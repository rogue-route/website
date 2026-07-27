"use client";

/**
 * NavBar — shared marketing nav (Task 1.1, updated)
 *
 * Desktop: horizontal bar, logo left, links right.
 * Mobile:  logo left, hamburger right → full-screen overlay with links.
 *
 * Animation: Framer Motion AnimatePresence on the mobile overlay only.
 * This is one of the 5 approved animation sites in PROJECT.md § 5.
 *
 * NEW — scroll-reactive header (only active on "/" where the hero lives):
 *   - At the top of the home page: fixed, transparent, white text, larger
 *     type, neon wordmark ("Rogue" green / "Route" pink) so it reads over
 *     the hero.
 *   - Once scrolled (or on any non-home route, since there's no hero to
 *     sit on top of): solid white background, black text, smaller type,
 *     black wordmark.
 *
 * Because the header is `fixed` (not `position: sticky`) so it can overlay
 * the hero image/video, non-home pages render a spacer of matching height
 * right after it so page content doesn't start underneath the bar.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
] as const;

const CTA_HREF = "/quiz";
const CTA_LABEL = "Take the quiz";

// Scroll distance (px) after which the header switches to its solid state.
const SCROLL_THRESHOLD = 60;

// Header heights for the two states — kept in one place so the nav bar,
// mobile overlay top row, and non-home spacer all agree.
const HEADER_HEIGHT_HERO = "h-20"; // transparent / large-type state
const HEADER_HEIGHT_SOLID = "h-20"; // scrolled / solid state

const LOGO_SRC = "/images/rogueroute-logo.svg";

// Recolors the logo file itself (white on the hero, black once scrolled) by
// using the SVG as a CSS mask over a solid-color <span>. This works for any
// single-tone silhouette logo — swap the two bg-* classes below if you ever
// want different colors than white/black.
function Wordmark({
  transparent,
  className,
}: {
  transparent: boolean;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="RogueRoute"
      className={cn(
        "inline-block transition-colors duration-300",
        transparent ? "bg-white" : "bg-carbon",
        className
      )}
      style={{
        height: "var(--logo-h)",
        aspectRatio: "1.6", // matches the w-32/h-20 ratio you'd landed on
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

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Only the home page has a hero to be transparent over. Every other
  // route renders the solid state from the very first frame.
  const transparent = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // set initial state (e.g. on refresh mid-scroll)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Lock body scroll while mobile overlay is open.
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      {/* ── Nav bar ──────────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className={cn(
          "fixed inset-x-0 top-0 z-40 w-full transition-all duration-300 ease-out",
          transparent
            ? HEADER_HEIGHT_HERO + " bg-transparent"
            : HEADER_HEIGHT_SOLID +
                " border-b border-fog bg-chalk-white text-carbon shadow-sm"
        )}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 md:px-10">
          {/* Logo / wordmark */}
          <Link
            href="/"
            aria-label="RogueRoute — Home"
            onClick={close}
            className={cn(
              "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              transparent
                ? "text-white focus-visible:outline-white"
                : "text-carbon focus-visible:outline-forest-ink"
            )}
          >
            <Wordmark transparent={transparent} />
          </Link>

          {/* ── Desktop links (hidden on mobile) ──────────────────── */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-medium tracking-[0.04em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  transparent
                    ? "text-lg text-white/90 hover:text-white focus-visible:outline-white"
                    : "text-lg text-ash hover:text-carbon focus-visible:outline-forest-ink"
                )}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {label}
              </Link>
            ))}

            {/* Desktop CTA */}
            <Link
              href={CTA_HREF}
              className={cn(
                "inline-flex items-center justify-center rounded font-medium tracking-[0.06em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                transparent
                  ? "px-6 py-2.5 text-lg border border-white text-white hover:bg-white hover:text-carbon focus-visible:outline-white"
                  : "px-6 py-2.5 text-lg bg-forest-ink text-true-white hover:bg-raw-sage focus-visible:outline-forest-ink"
              )}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {CTA_LABEL}
            </Link>
          </div>

          {/* ── Hamburger (visible on mobile only) ────────────────── */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-overlay"
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded md:hidden",
              "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              transparent
                ? "hover:bg-white/10 focus-visible:outline-white"
                : "hover:bg-fog focus-visible:outline-forest-ink"
            )}
          >
            {/* Three-bar icon — morphs to X via CSS when open */}
            <span
              className={cn(
                "block h-px w-5 transition-transform duration-200",
                transparent ? "bg-white" : "bg-carbon",
                mobileOpen && "translate-y-[6px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-px w-5 transition-opacity duration-200",
                transparent ? "bg-white" : "bg-carbon",
                mobileOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-px w-5 transition-transform duration-200",
                transparent ? "bg-white" : "bg-carbon",
                mobileOpen && "-translate-y-[6px] -rotate-45"
              )}
            />
          </button>
        </div>
      </nav>

      {/* Spacer: on non-home routes there's no hero for the transparent
          state to sit over, so the bar starts solid immediately and this
          keeps page content from rendering underneath the fixed nav. */}
      {!isHome && <div className={HEADER_HEIGHT_SOLID} aria-hidden="true" />}

      {/* ── Mobile full-screen overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col bg-chalk-white md:hidden"
          >
            {/* Top row: logo + close button mirror the nav bar. Overlay
                background is always solid, so the wordmark is always the
                dark/solid variant regardless of scroll or transparent state. */}
            <div className="flex h-14 items-center justify-between border-b border-fog px-5">
              <Link href="/" onClick={close} className="text-carbon">
                <Wordmark transparent={false} />
              </Link>

              {/* Close (X) button */}
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-fog focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
              >
                {/* Static X — overlay is already animating in/out */}
                <span className="block h-px w-5 rotate-45 bg-carbon" />
                <span className="-ml-5 block h-px w-5 -rotate-45 bg-carbon" />
              </button>
            </div>

            {/* Nav links */}
            <nav
              aria-label="Mobile navigation links"
              className="flex flex-1 flex-col px-5 pt-8"
            >
              <ul className="space-y-1" role="list">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={close}
                      className="block py-3 text-lg font-light tracking-[0.02em] text-carbon transition-colors hover:text-forest-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile CTA — full width, sits below the links */}
              <div className="mt-8">
                <Link
                  href={CTA_HREF}
                  onClick={close}
                  className="flex w-full items-center justify-center rounded bg-forest-ink px-6 py-3 text-sm font-medium tracking-[0.06em] text-true-white transition-colors hover:bg-raw-sage focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {CTA_LABEL}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}