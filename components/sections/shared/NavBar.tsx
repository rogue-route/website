"use client";

/**
 * NavBar — shared marketing nav (Task 1.1)
 *
 * Desktop: horizontal bar, logo left, links right.
 * Mobile:  logo left, hamburger right → full-screen overlay with links.
 *
 * Animation: Framer Motion AnimatePresence on the mobile overlay only.
 * This is one of the 5 approved animation sites in PROJECT.md § 5.
 * Nothing else animates here.
 *
 * Static only — no scroll-reactive behaviour for v1.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
] as const;

const CTA_HREF = "/quiz";
const CTA_LABEL = "Take the quiz";

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll while mobile overlay is open.
  // A simple CSS approach: toggle overflow-hidden on <body>.
  // This prevents the page behind scrolling on iOS/Android.
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up if the component unmounts while open
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      {/* ── Nav bar ──────────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="w-full border-b border-fog bg-chalk-white"
      >
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5">
          {/* Logo / wordmark */}
          <Link
            href="/"
            className="font-heading text-xl font-light tracking-[0.06em] text-carbon transition-colors hover:text-forest-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
            style={{ fontFamily: "var(--font-cormorant)" }}
            onClick={close}
          >
            RogueRoute
          </Link>

          {/* ── Desktop links (hidden on mobile) ──────────────────── */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium tracking-[0.04em] text-ash transition-colors hover:text-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {label}
              </Link>
            ))}

            {/* Desktop CTA */}
            <Link
              href={CTA_HREF}
              className="inline-flex items-center justify-center rounded bg-forest-ink px-5 py-2 text-sm font-medium tracking-[0.06em] text-true-white transition-colors hover:bg-raw-sage focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
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
              "transition-colors hover:bg-fog focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-ink"
            )}
          >
            {/* Three-bar icon — morphs to X via CSS when open */}
            <span
              className={cn(
                "block h-px w-5 bg-carbon transition-transform duration-200",
                mobileOpen && "translate-y-[6px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-carbon transition-opacity duration-200",
                mobileOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-carbon transition-transform duration-200",
                mobileOpen && "-translate-y-[6px] -rotate-45"
              )}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen overlay ─────────────────────────────────── */}
      {/*
       * AnimatePresence unmounts the overlay when closed (not just hidden),
       * which means it's out of the tab order when not visible — correct.
       *
       * Motion spec from PROJECT.md § 5: "Slide/fade open-close".
       * Kept to 5-line variant as specified.
       */}
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
            {/* Top row: logo + close button mirror the nav bar */}
            <div className="flex h-14 items-center justify-between border-b border-fog px-5">
              <Link
                href="/"
                onClick={close}
                className="font-heading text-xl font-light tracking-[0.06em] text-carbon"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                RogueRoute
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
