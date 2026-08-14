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
import MouseScroll from "@/components/primitives/MouseScroll";
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

const neonFlicker = {
  animate: {
    filter: [
      "brightness(0.3)", 
      "brightness(0.85)", 
      "brightness(0.1)", 
      "brightness(1)", 
      "brightness(0.9)", 
      "brightness(1.1)", // slight surge
      "brightness(0.3)", // deep flicker
      "brightness(1)", 
      "brightness(1)"
    ],
    opacity: [1, 0.95, 1, 1, 0.95, 1, 0.8, 1, 1], // Subtle opacity drops to compound the effect
    transition: {
      duration: 5, // How long the full loop takes
      ease: "linear" as const,
      repeat: Infinity,
      // The 'times' array maps to the array items above to dictate exactly *when* the flickers happen in the 3.5s window
      times: [0, 0.05, 0.08, 0.5, 0.52, 0.55, 0.58, 0.65, 1], 
    },
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
        <motion.div className="relative block aspect-[4/5] w-full md:hidden"
          // variants={neonFlicker} animate="animate"
          >
          <Image
            src="/images/brick-wall-mobile.png"
            alt="RogueRoute skincare — Go Rogue"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 0px"
            className="object-cover"
          />
        </motion.div>

        {/* Desktop image — shown at md and above */}
        <motion.div 
        className="relative hidden aspect-[16/9] w-full md:block" 
        // variants={neonFlicker} animate="animate"
        >
          <Image
            src="/images/brick-wall-desktop.png"
            alt="Rogue Route skincare — Go Rogue"
            fill
            priority
            sizes="(min-width: 768px) 100vw, 0px"
            className="object-cover"
          />
        </motion.div>

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
            className="mb-3 tracking-[0.1em] uppercase text-white w-fit"
            style={{ fontFamily: "var(--font-dm-sans)", 
              fontWeight: 500, 
              fontSize: "clamp(12px, 1.5vw, 14px)",
              // backgroundColor: "rgba(31, 58, 51,0.60)",
              // padding: "0.2em 0.4em",
            }}
          >
            Your skin's first line of defence.
          </p>

          {/* Hero headline — Cormorant Garamond, weight 300, fluid size */}
          <h1
            className="text-white w-fit"
            style={{
              fontFamily: "var(--font-league-spartan)",
              fontSize: "var(--text-hero)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              maxWidth: "25ch",
              // backgroundColor: "rgba(0, 0, 0, 0.40)",
              // backgroundColor: "rgba(31, 58, 51,0.60)",
              // padding: "0.2em 0.4em",
            }}
          >
            Minimal Ingredient formulations{" "}
            <span style={{ 
              // color: "var(--rr-parchment)",
              fontFamily:"var(--font-league-spartan)", fontWeight: 700
            }}><br />For <span style={{color: "rgba(110, 248, 5, 0.8)" }}>Ultra-Sensitive</span> skin.</span>
          </h1>

          {/* Subheadline — DM Sans, body size */}
          <p
            className="mt-4 text-white/80 md:mt-5 w-fit"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "clamp(12px, 2vw, 24px)",
              fontWeight: 600,
              lineHeight: 1.65,
              maxWidth: "44ch",
              // backgroundColor: "rgba(31, 58, 51,0.60)", 
              // padding: "0.2em 0.4em",
            }}
          >
            Designed to support and protect the skin barrier.
          </p>

          {/* CTA — Link styled with buttonVariants.
               @base-ui Button doesn't support asChild/Slot, so we apply
               the variant classes directly to the <Link> element instead. */}
          <div className="mt-7 md:mt-8">
            <Link
              href="/quiz"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-forest-ink text-true-white hover:bg-true-white hover:text-forest-ink",
                "text-[clamp(0.8rem,1.3vw,1.4rem)]",
                "px-[clamp(1.2rem,3vw,3rem)]",
                "py-[clamp(1.2rem,3vw,3.4rem)]",
                "rounded-xl"
              )}
            >
              Find your routine <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <MouseScroll targetId="introduction" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
