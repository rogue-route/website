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
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        <div className="border-t border-fog pt-16 md:pt-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">

            {/* Left: copy */}
            <div className="flex flex-col justify-center">
              <p
                className="mb-3 text-xs font-medium tracking-[0.1em] uppercase text-ash"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Get in touch
              </p>

              <h2
                id="contact-heading"
                className="text-carbon"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(28px, 6vw, 52px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                Questions? We'd like to hear them.
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
