/**
 * LaunchBanner — Task 2.2
 *
 * Static "Launching Soon" block that sits directly below the Hero section.
 * Renders as a Server Component; SplitFlapText and BorderGlow are client
 * components internally (they declare their own "use client"), so no
 * "use client" is needed here.
 *
 * Design decisions:
 * - Chalk White background keeps it reading as part of the page body,
 *   not a floating alert per PROJECT.md.
 * - Horizontal padding matches HeroSection's content overlay exactly
 *   (px-5 / md:px-10 / lg:px-16) so the left edge of text lines up
 *   across the Hero → LaunchBanner transition.
 * - Vertical padding follows PROJECT.md § 3: 64px mobile, 96px desktop
 *   (previously reversed).
 * - BorderGlow wraps only the "Coming soon" pill — it's a self-contained
 *   card component (own bg + radius, cursor-proximity glow), not a
 *   full-section wrapper. Using it on the whole section fights the
 *   "reads as part of the page body" decision above.
 * - No countdown timer — TASK.md explicitly says "no countdown logic needed".
 */

import BorderGlow from "@/components/primitives/BorderGlow";
import SplitFlapText from "@/components/primitives/SplitFlapText";

export function LaunchBanner() {
  return (
    <section aria-label="Launch announcement" className="w-full bg-chalk-white">
      <div className="w-full px-5 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
        {/* Thin top rule — Fog border separates from hero edge */}
        <div className="border-t border-fog pt-10 md:pt-12">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            {/* Left: eyebrow + headline + subhead */}
            <div className="max-w-[52ch]">
              <div className="mb-6">
                <SplitFlapText
                  words={["LAUNCHING SOON", "COMING SHORTLY"]}
                  flipDuration={0.12}
                  stagger={0.06}
                  cycleDelay={1200}
                  charset="alphanumeric"
                  flipsPerChar={8}
                  tileColor="var(--rr-forest-ink)"
                  textColor="#f8fafc"
                  tileRadius={6}
                  gap={4}
                  fontSize="clamp(18px, 2.4vw, 38px)"
                  loop
                  padTo={12}
                />
              </div>

              <h2
                className="text-carbon"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(32px, 6vw, 76px)",
                  fontWeight: 600,
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
                  fontSize: "clamp(16px, 1.6vw, 24px)",
                  fontWeight: 400,
                  lineHeight: 1.65,
                }}
              >
                We're putting the finishing touches on formulations designed
                around evidence, not marketing claims. Be first to know when
                we open.
              </p>
            </div>

            {/* Right: Coming soon pill — the one spot BorderGlow actually fits */}
            <div className="shrink-0">
              <BorderGlow
                edgeSensitivity={40}
                glowColor="38 45 65"
                backgroundColor="var(--rr-parchment)"
                borderRadius={999}
                glowRadius={20}
                glowIntensity={1.1}
                coneSpread={35}
                animated
              >
                <p
                  className="px-5 py-2.5 text-xs tracking-[0.1em] uppercase text-forest-ink"
                  style={{ fontFamily: "var(--font-dm-mono)", fontWeight: 500 }}
                >
                  — Coming soon
                </p>
              </BorderGlow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}