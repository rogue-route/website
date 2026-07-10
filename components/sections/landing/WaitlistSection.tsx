/**
 * WaitlistSection — Task 2.3
 *
 * Page-level section block. Server Component shell — the interactive
 * NewsletterForm compound is rendered inside (it handles its own "use client"
 * boundary), so this wrapper stays a Server Component.
 *
 * Layout: two-column on desktop (copy left, form right),
 * single column stacked on mobile.
 *
 * Background: True White surface card lifts the form off the Chalk White page.
 * Section padding follows PROJECT.md § 3: 64px mobile / 96px desktop.
 */

import { NewsletterForm } from "@/components/compounds/forms/NewsletterForm";

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="w-full bg-chalk-white"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        <div className="border-t border-fog pt-16 md:pt-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">

            {/* Left: copy */}
            <div className="flex flex-col justify-center">
              <p
                className="mb-3 text-xs font-medium tracking-[0.1em] uppercase text-ash"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Early access
              </p>

              <h2
                id="waitlist-heading"
                className="text-carbon"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(28px, 6vw, 52px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                Be first in line.
              </h2>

              <p
                className="mt-5 max-w-[40ch] text-ash"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: 1.65,
                }}
              >
                Sign up and we'll let you know the moment we're live — before
                anyone else. No spam, no pressure, just one email when it
                matters.
              </p>
            </div>

            {/* Right: form */}
            <div className="flex flex-col justify-center">
              <div className="rounded-lg border border-fog bg-true-white p-6 md:p-8">
                <NewsletterForm />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
