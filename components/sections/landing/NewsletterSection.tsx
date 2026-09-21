"use client";

import { NewsletterForm } from "@/components/compounds/forms/NewsletterForm";
import SideRays from "@/components/primitives/SideRays";

/**
 * Background options. Change ACTIVE_THEME to try each one.
 *  - forest   : your brand green (--rr-forest-ink), most on-brand
 *  - midnight : deep navy, makes the blue ray glow
 *  - ink      : near-black with a green tint, most dramatic
 *  - plum     : dark violet, the most "rogue" of the four
 */
const THEMES = {
  forest: { bg: "var(--rr-forest-ink)" },
  midnight: { bg: "#0f141d" },
  ink: { bg: "#0E1512" },
  plum: { bg: "#553279" },
} as const;

const ACTIVE_THEME: keyof typeof THEMES = "forest";

export function NewsletterSection() {
  const theme = THEMES[ACTIVE_THEME];

  return (
    <div className="bg-chalk-white">
  <div className="mx-auto max-w-[1200px] px-5">
    <div aria-hidden="true" className="border-t-[3px] border-fog" />
  </div>
  <div className="pt-4 md:pt-6">
    {/* <div className="border-t border-fog pt-6 md:pt-8 lg:pt-10">  */}
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Separation line from waitlist section */}
      {/* <div className="border-t border-fog pt-6 md:pt-8 lg:pt-10"> */}
      {/* Background layer: fills the whole section, never affects layout */}
      {/* <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <SideRays
          speed={2.5}
          rayColor1="#EAB308"
          rayColor2="#d2e2f3"
          intensity={2}
          spread={20}
          origin="top-right"
          tilt={90}
          saturation={80.5}
          blend={0.75}
          falloff={1.6}
          opacity={0.3}
        />
      </div> */}

      {/* Content layer: sits above the rays, height comes from the content */}
      {/* <div className="relative z-10 mx-auto max-w-[1800px] px-5 md:py-28"> */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-5 py-[clamp(4rem,10vw,4rem)]">
        <div className="mx-auto flex max-w-[1800px] flex-col items-center text-center">
          {/* <span aria-hidden="true" className="mb-4 text-3xl md:text-4xl">
            🧭
          </span> */}

          <div className="flex flex-col justify-center">
            <p
              className="mb-3 uppercase tracking-[0.1em]"
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 700,
                color: "#EAB308",
                fontSize: "clamp(12px, 1.5vw, 14px)",
              }}
            >
              The Rogue Dispatch
            </p>

            <h2
              id="newsletter-heading"
              className="text-chalk-white text-balance"
              style={{
                fontFamily: "var(--font-league-spartan)",
                fontSize: "clamp(32px, 5vw, 64px)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              Unapologetic letters about skincare and more.
            </h2>

            <p
              className="mx-auto mt-5 max-w-[52ch] text-chalk-white"
              style={{
                fontFamily: "var(--font-league-spartan)",
                fontSize: "clamp(16px, 2.5vw, 24px)",
                fontWeight: 500,
                lineHeight: 1.65,
                letterSpacing: "-0.01em",
                opacity: 0.8,
              }}
            >
              Unfiltered ingredient truths, routines that break the rules, and
              first dibs on every drop. No gatekeeping, no filler.
            </p>
          </div>

          <div className="mt-[clamp(1.5rem,4vw,2.5rem)] 
          flex w-[clamp(17rem,100%,50rem)] 
          max-w-full flex-col justify-center">
            <div className="rounded-lg border border-fog bg-true-white p-[clamp(1rem,4vw,2rem)]">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>
      
    </section>
    </div>
    </div>
  );
}