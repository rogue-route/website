/**
 * ManifestoSection — Task 3.1
 *
 * Brand story block: headline + body paragraphs.
 * Server Component — no interactivity required.
 *
 * Design decisions:
 * - Chalk White background, same as landing page sections — visual continuity.
 * - Section heading uses Cormorant Garamond weight 400 at the section scale
 *   (`clamp(28px, 6vw, 52px)`) per PROJECT.md § 3.
 * - Body uses DM Sans 300 at 16px / 1.65 — the base body spec.
 * - Copy follows PROJECT.md § 2 brand voice: scientific, transparent,
 *   evidence-based. No exaggeration. No forbidden words.
 * - max-width on body copy capped at ~70ch for comfortable reading measure.
 * - Section padding: 64px mobile / 96px desktop per PROJECT.md § 3.
 * - No animation — PROJECT.md § 5 explicitly cuts scroll-triggered reveals for v1.
 */

export function ManifestoSection() {
  return (
    <section
      aria-labelledby="manifesto-heading"
      className="w-full bg-chalk-white"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">

        {/* Top rule — consistent with landing page section separators */}
        <div className="border-t border-fog pt-16 md:pt-24">

          {/* Eyebrow */}
          <p
            className="mb-4 text-xs font-medium tracking-[0.1em] uppercase text-ash"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Our story
          </p>

          {/* Headline */}
          <h1
            id="manifesto-heading"
            className="text-carbon"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(28px, 6vw, 52px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              maxWidth: "22ch",
            }}
          >
            Built on evidence, not on expectation.
          </h1>

          {/* Body copy — two paragraphs, comfortable reading measure */}
          <div
            className="mt-8 space-y-5 text-ash md:mt-10"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "16px",
              fontWeight: 300,
              lineHeight: 1.65,
              maxWidth: "68ch",
            }}
          >
            <p>
              Most skincare is formulated around aspiration — the promise of
              transformation, the suggestion of instant results. We started
              RogueRoute because we were tired of that contract. Skin is
              complex, individual, and slow to change. Any brand that tells
              you otherwise is selling you something other than skincare.
            </p>
            <p>
              Every formulation we develop starts with a question: what does
              the evidence actually support? We read the studies. We talk to
              dermatologists. We test on real skin types over real time
              periods. If an ingredient doesn't have a credible mechanism,
              it doesn't go in the product — regardless of how good it looks
              on a label.
            </p>
            <p>
              Transparency isn't a marketing position for us. It's the only
              way we know how to work. We'll tell you what's in our products,
              why it's there, and — just as importantly — what it won't do.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
