"use client";
/**
 * HeroSection — Task 2.1
 *
 * Architecture notes:
 * - "use client" is required here only for the Framer Motion entrance animation.
 *   If animation is ever removed this becomes a pure Server Component.
 * - Two <Image> elements handle mobile vs desktop: `block md:hidden` / `hidden md:block`.
 *   Both carry `priority` so Next.js preloads them — prevents LCP penalty.
 * - Image src paths point to public/images/hero-mobile.jpg and hero-desktop.jpg.
 *   Until those files exist, the section renders with a Forest Ink placeholder background
 *   (set on the image wrapper) — no layout shift, no broken img tags.
 * - Animation: single motion.div fade+slide on mount. 5-line Framer variant per PROJECT.md § 5.
 *   No AnimatePresence — this is a mount-only entrance, not a conditional exit.
 */

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

/**
 * Framer Motion variant — fade up on mount.
 * Matches PROJECT.md § 5: "Simple fade/slide-in on load (CSS or 5-line Framer variant)"
 */
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    // Cubic-bezier typed as a 4-tuple — Framer Motion v12 requires this
    // to satisfy the Easing[] constraint (not a plain number[]).
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative w-full overflow-hidden"
    >
      {/* ── Image layer ──────────────────────────────────────────────────────
          Forest Ink bg shows while images load (or if files are missing).
          aspect-ratio locks height so no layout shift occurs.
          Mobile image: 4:5 portrait. Desktop image: 16:9 landscape.
      ─────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full bg-forest-ink">
        {/* Mobile image — shown below md breakpoint */}
        <div className="relative block aspect-[4/5] w-full md:hidden">
          <Image
            src="/images/hero-mobile.png"
            alt="RogueRoute skincare — go your own way"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 0px"
            className="object-cover"
          />
        </div>

        {/* Desktop image — shown at md and above */}
        <div className="relative hidden aspect-[16/9] w-full md:block">
          <Image
            src="/images/hero-desktop.png"
            alt="RogueRoute skincare — go your own way"
            fill
            priority
            sizes="(min-width: 768px) 100vw, 0px"
            className="object-cover"
          />
        </div>

        {/* Overlay gradient — bottom-up scrim so text is always readable
            regardless of image brightness. Stays within brand restraint:
            no decorative gradients, this is purely functional legibility. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          aria-hidden="true"
        />

        {/* ── Content layer ──────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-x-0 bottom-0 px-5 pb-12 md:px-10 md:pb-16 lg:px-16 lg:pb-20"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow label */}
          <p
            className="mb-3 text-xs tracking-[0.1em] uppercase text-white/70"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500 }}
          >
            Skincare, your way
          </p>

          {/* Hero headline — Cormorant Garamond, weight 300, fluid size */}
          <h1
            className="text-white"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(36px, 8vw, 72px)",
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              maxWidth: "18ch",
            }}
          >
            Formulated to work.{" "}
            <em style={{ fontStyle: "italic" }}>For you.</em>
          </h1>

          {/* Subheadline — DM Sans, body size */}
          <p
            className="mt-4 text-white/80 md:mt-5"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "clamp(15px, 2vw, 18px)",
              fontWeight: 300,
              lineHeight: 1.65,
              maxWidth: "44ch",
            }}
          >
            Evidence-based skincare designed for how your skin actually
            behaves — not how the industry wishes it did.
          </p>

          {/* CTA — Link styled with buttonVariants.
               @base-ui Button doesn't support asChild/Slot, so we apply
               the variant classes directly to the <Link> element instead. */}
          <div className="mt-7 md:mt-8">
            <Link
              href="/quiz"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-true-white text-forest-ink hover:bg-fog"
              )}
            >
              Find your routine <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
