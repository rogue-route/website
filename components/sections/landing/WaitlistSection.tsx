/**
 * WaitlistSection — Task 2.3
 *
 * Page-level section block. Server Component shell — the interactive
 * WaitlistForm compound is rendered inside (it handles its own "use client"
 * boundary), so this wrapper stays a Server Component. ShinyText and
 * ShinyMask are Client Components too, and Server Components can render
 * Client Components directly, so this file needs no "use client" of its own.
 *
 * Layout: two-column on desktop (copy left, form right),
 * single column stacked on mobile.
 *
 * Background: True White surface card lifts the form off the Chalk White page.
 * Section padding follows PROJECT.md § 3: 64px mobile / 96px desktop.
 */

import { WaitlistForm } from "@/components/compounds/forms/WaitlistForm";
import ShinyText from "@/components/primitives/ShinyText";
import ShinyMask from "@/components/primitives/ShinyMask";

const GO_ROGUE_SVG_SRC = "/images/go-rogue-text.svg";

// Shared shine parameters — kept in one place so the heading text and the
// logo sweep stay visually in sync if these ever need tuning.
const SHINE_SHARED = {
  shineColor: "rgba(250, 250, 6, 0.95)",
  spread: 30,
  delay: 2,
  direction: "right" as const,
  pauseOnHover: true,
};

function GoRogueImage() {
  return (
    <img
      src={GO_ROGUE_SVG_SRC}
      alt="Go Rogue"
      className="w-auto drop-shadow-md"
      style={{ 
        height: "clamp(3.5rem, 1.6rem + 3.5vw, 8.5rem)",
        transform: `
          translateX(clamp(-0.05em, -0.01rem - 1vw, -0.3em)) 
          translateY(clamp(-0.2em, -0.5rem - 0.5vw, -3.5em))
        `
      }}
    />
  );
}


export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="w-full bg-chalk-white"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-24 md:py-24">
        <div className="border-t-[3px] border-fog pt-16 md:pt-24">

            {/*
              Early access label, heading, and logo live above the grid —
              full section width, so "Go Rogue" has room to stay on the
              same line as the heading text instead of wrapping.
            */}
            <div className="mb-10 md:mb-12">
              <p
                className="mb-3 tracking-[0.1em] uppercase text-ash"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 500,
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                  }}
              >
                Early access
              </p>

              <h2
                id="waitlist-heading"
                className="flex flex-wrap items-center gap-x-3 gap-y-2 text-carbon"
                style={{
                  fontFamily: "var(--font-league-spartan)",
                  fontSize: "clamp(32px, 5vw, 64px)",
                  color: "var(--rr-forest-ink)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                <ShinyText
                  text="Be first in line to"
                  color="var(--rr-forest-ink)"
                  {...SHINE_SHARED}
                />
                {/* <ShinyText
                  text="Go"
                  color="rgb(110, 248, 5)"
                  className="italic"
                  {...SHINE_SHARED}
                />
                <ShinyText
                  text="Rogue"
                  color="rgb(248, 5, 216)"
                  className="italic"
                  {...SHINE_SHARED}
                /> */}
                {/*
                  Logo wordmark — sized in em, so it scales directly off the
                  h2's font-size (same clamp() above) instead of tracking its
                  own separate breakpoints. Real SVG colors (F6036A "Go" /
                  B8E00A "Rogue") preserved via an <img>, with a mask-clipped
                  shine overlay driven by the same animation math as ShinyText.
                */}
                {/* <ShinyMask
                  src={GO_ROGUE_SVG_SRC}
                  alt="Go Rogue"
                  {...SHINE_SHARED}
                  className="drop-shadow-md transition-opacity
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    height: "clamp(3em, 5vw, 4em)",
                    width: "clamp(4.6em, 10vw, 12.25em)",
                    transform: "translateY(-0.15em) translateX(0.2em)",
                  }}
                /> */}
                {/* <div
                className={`w-px bg-fog`}
                aria-hidden="true"
              /> */}
              <GoRogueImage />
            {/* </div> */}
            </h2>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">

              {/* Left: copy */}
              <div className="flex flex-col justify-center">
                <p
                  className="max-w-[40ch] text-ash"
                  style={{
                    fontFamily: "var(--font-league-spartan)",
                    fontSize: "clamp(16px, 2.5vw, 24px)",
                    fontWeight: 500,
                    lineHeight: 1.65,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Sign up and we'll let you know the moment we're live before
                  anyone else. No spam, no pressure, just one email when it
                  matters.
                </p>
              </div>

              {/* Right: form */}
              <div className="flex flex-col justify-center">
                <div className="rounded-lg border border-fog bg-true-white p-6 md:p-8">
                  <WaitlistForm />
                </div>
              </div>

            </div>
        </div>
      </div>
    </section>
  );
}