/**
 * ContactSection — Task 2.4
 *
 * Page-level section block. Server Component shell — ContactForm compound
 * handles its own "use client" boundary.
 *
 * Mirrors the WaitlistSection layout: two-column on desktop
 * (copy left, form right), single column on mobile.
 *
 * Background: Chalk White — same as WaitlistSection, keeps the page
 * visually unified. The form card uses True White surface to float.
 */

import { ContactForm } from "@/components/compounds/forms/ContactForm";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="w-full bg-chalk-white"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:py-12">
        <div className="border-t border-fog pt-16 md:pt-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">

            {/* Left: copy */}
            <div className="flex flex-col justify-center">
              <p
                className="mb-3 tracking-[0.1em] uppercase text-ash"
                style={{ fontFamily: "var(--font-dm-sans)",
                  fontWeight: 500, 
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                 }}
              >
                Get in touch
              </p>

              <h2
                id="contact-heading"
                className="text-carbon"
                style={{
                  fontFamily: "var(--font-league-spartan)",
                  fontSize: "clamp(32px, 5vw, 52px)",
                  fontWeight: 700,
                  color: "var(--rr-forest-ink)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                Questions? We'd like to hear them...
              </h2>

              <p
                className="mt-5 max-w-[40ch] text-ash"
                style={{
                  fontFamily: "var(--font-league-spartan)",
                  fontSize: "clamp(16px, 2.5vw, 24px)",
                  fontWeight: 500,
                  lineHeight: 1.65,
                  letterSpacing: "-0.01em",
                }}
              >
                Whether it's about our formulations, our ingredients, or
                how we work — ask us anything. We're transparent by design.
              </p>
            </div>

            {/* Right: form */}
            <div className="flex flex-col justify-center">
              <div className="rounded-lg border border-fog bg-true-white p-6 md:p-8">
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
