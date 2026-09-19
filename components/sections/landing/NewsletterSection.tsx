import { NewsletterForm } from "@/components/compounds/forms/NewsletterForm";

export function NewsletterSection() {
  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="w-full bg-chalk-white"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-12 md:py-12">
        <div className="border-t border-fog pt-16 md:pt-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center">
              <p
                className="mb-3 text-ash uppercase tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 500,
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                }}
              >
                Newsletter
              </p>

              <h2
                id="newsletter-heading"
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
                Evidence, without the noise.
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
                Subscribe for thoughtful skincare guidance, formulation notes,
                and RogueRoute updates. No launch waitlist required.
              </p>
            </div>

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
