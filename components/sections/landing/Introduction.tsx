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

import RippleDistortion from "@/components/primitives/RippleDistortion";
import ShinyText from "@/components/primitives/ShinyText";
import BlurText from "@/components/primitives/BlurText";

export function Introduction() {
  return (
    <section
      id="introduction" aria-label="Introduction"
      className="w-full bg-chalk-white px-5 pt-8 md:px-10 md:pt-10 lg:px-16 lg:pt-12"
    >
      {/* Separation line from Hero */}
      <div className="border-t-[3px] border-fog pt-6 md:pt-8 lg:pt-10">
        {/* Ripple visual container */}
        <div className="relative min-h-[420px] w-full overflow-hidden md:min-h-[500px] lg:min-h-[560px]">
          
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <RippleDistortion
              src="/images/product_sample.jpg"
              brushSize={150}
              strength={0.2}
              swirl={2}
              rings={2}
              grayscale={false}
              spread={5}
              fade={3}
              spacing={15}
              dispersion={2}
              glint={0}
              tint="#a855f7"
              tintAmount={0.1}
              highlightColor="#ffffff"
              trigger="hover"
              clickStrength={2}
              quality="low"
              enabled
            />
          </div>

          {/* Subtle overlay for readability */}
          {/* <div className="absolute inset-0 z-10 bg-black/30" /> */}
          {/* Blur + darkening */}
          <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[2px]" />


          {/* Centered content */}
          <div className="relative z-20 flex min-h-[420px] items-center justify-center px-6 py-16 text-center md:min-h-[500px] md:px-12 md:py-20 lg:min-h-[560px] lg:px-16">
            <div className="mx-auto max-w-4xl">
              <h2
                style={{
                  fontFamily: "var(--font-league-spartan)",
                  fontSize: "clamp(38px, 6vw, 76px)",
                  color: "rgba(80, 0, 20, 0.90)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  // WebkitTextStroke: "1px rgba(0, 0, 0, 0.5)",
                  // textShadow: `
                  //       -2px -2px 0 black,
                  //       2px -2px 0 black,
                  //       -2px  2px 0 black,
                  //       2px  2px 0 black
                  //     `,
                  // backgroundColor: "rgba(31, 58, 51,0.60)",
                  // padding: "0.2em 0.4em",
                }}
              >
                {/* <ShinyText
                  text="Skincare that tells you the Truth"
                  color="var(--rr-forest-ink)"
                  shineColor="rgba(250, 250, 6, 0.95)"
                  spread={45}
                  delay={2}
                  direction="right"
                  pauseOnHover={true}
                /> */}
                {/* <BlurText
                    text="Skincare that tells you the Truth"
                    // highlightWords={["Truth"]}
                    // highlightColor="rgba(255, 16, 240, 1)"
                    delay={200}
                    animateBy="words"
                    direction="top"
                    className="justify-center text-center"
                  /> */}
                  Skincare that tells you the Truth
              </h2>

              <p
                className="mx-auto mt-6 max-w-2xl"
                style={{
                  fontFamily: "var(--font-league-spartan)",
                  color: "rgba(80, 0, 20, 0.90)",
                  fontSize: "clamp(15px, 1.5vw, 21px)",
                  fontWeight: 700,
                  lineHeight: 1.6,
                  letterSpacing: "0.05em",
                  // backgroundColor: "rgba(31, 58, 51,0.60)",
                  // padding: "0.2em 0.4em",
                }}
              >
                We're putting the finishing touches on formulations designed
                around evidence, not marketing claims. Be first to know when
                we open.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
