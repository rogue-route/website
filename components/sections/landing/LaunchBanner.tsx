/**
 * LaunchBanner — Task 2.2
 *
 * Static "Launching Soon" block that sits directly below the Hero section.
 * Server Component — no interactivity, no client JS needed.
 *
 * Design decisions:
 * - Chalk White background keeps it reading as part of the page body,
 *   not a floating alert. True White would float it; Forest Ink would
 *   make it feel like a second hero. Chalk White is correct per PROJECT.md.
 * - Parchment badge is the one warm-accent element per PROJECT.md § 3:
 *   "warm accent (tags)" — exactly the right use case here.
 * - Section padding follows PROJECT.md § 3: 64px mobile, 96px desktop.
 * - Max-width 1200px container, 20px mobile side padding — design system spec.
 * - No countdown timer — TASK.md explicitly says "no countdown logic needed".
 */

import { Badge } from "@/components/primitives/Badge";

export function LaunchBanner() {
  return (
    <section
      aria-label="Launch announcement"
      className="w-full bg-chalk-white"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        {/* Thin top rule — Fog border separates from hero edge */}
        <div className="border-t border-fog pt-16 md:pt-24">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">

            {/* Left: badge + headline */}
            <div className="max-w-[52ch]">
              <Badge variant="accent" className="mb-5 tracking-[0.06em] uppercase">
                Launching Soon
              </Badge>

              <h2
                className="text-carbon"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(28px, 6vw, 52px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                Skincare that tells you the truth.
              </h2>

              <p
                className="mt-5 text-ash"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: 1.65,
                }}
              >
                We're putting the finishing touches on formulations designed
                around evidence, not marketing claims. Be first to know when
                we open.
              </p>
            </div>

            {/* Right: supporting detail — DM Mono, data-feel */}
            <div className="shrink-0">
              <p
                className="text-xs tracking-[0.1em] uppercase text-ash"
                style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 400 }}
              >
                — Coming soon
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
