/**
 * ValuesSection — Task 3.2
 *
 * 4 value cards in a responsive grid.
 * Server Component — no interactivity or animation needed.
 *
 * Design decisions:
 * - No scroll-triggered animation. PROJECT.md § 5 explicitly states
 *   "No scroll-triggered reveals... for v1." TASK.md says the animation
 *   is "optional, skip if it adds friction" — PROJECT.md is the source
 *   of truth and it cuts this. Static cards are the correct call.
 * - Grid: 1 col mobile → 2 col tablet (sm) → 4 col desktop (lg).
 *   4 equal columns on wide screens avoids orphaned cards on any breakpoint.
 * - True White card surface lifts off the Chalk White section background —
 *   same surface/background pairing used throughout the site.
 * - Card number in DM Mono — "Data/scores/progress" font per PROJECT.md § 3.
 *   Keeps the clinical-but-warm aesthetic without decorative icons.
 * - Fog border on cards, no shadow — restraint over decoration (PROJECT.md § 2).
 * - Copy stays within brand voice: no exaggeration, no forbidden words.
 * - max 3 colours per section (PROJECT.md § 3): Carbon, Ash, Fog. ✓
 */

interface ValueCard {
  number: string;
  title: string;
  body: string;
}

const VALUES: ValueCard[] = [
  {
    number: "01",
    title: "Evidence first",
    body: "Every ingredient is selected because the evidence supports its use — not because it photographs well or trends on social. We read the studies so you don't have to.",
  },
  {
    number: "02",
    title: "Transparent by design",
    body: "Full ingredient lists, plain-language explanations, and honest statements about what a product is formulated to do and what it isn't. No proprietary blends used to obscure.",
  },
  {
    number: "03",
    title: "Formulated for individuals",
    body: "Skin is not one-size-fits-all. Our quiz is designed to help you understand your skin's actual behaviour — then connect you with formulations that support it.",
  },
  {
    number: "04",
    title: "Minimal, intentional",
    body: "Fewer products used consistently outperform complex routines used inconsistently. We design for real life: concise ingredient lists, straightforward application, measurable results.",
  },
];

export function ValuesSection() {
  return (
    <section
      aria-labelledby="values-heading"
      className="w-full bg-chalk-white"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        <div className="border-t border-fog pt-16 md:pt-24">

          {/* Section header */}
          <p
            className="mb-4 text-xs font-medium tracking-[0.1em] uppercase text-ash"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            How we work
          </p>

          <h2
            id="values-heading"
            className="text-carbon"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(28px, 6vw, 52px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              maxWidth: "24ch",
            }}
          >
            Four principles we don't compromise on.
          </h2>

          {/* Cards grid */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
            {VALUES.map((value) => (
              <article
                key={value.number}
                className="flex flex-col rounded-lg border border-fog bg-true-white p-6"
              >
                {/* Card number — DM Mono, subtle */}
                <span
                  className="mb-5 text-xs text-ash"
                  style={{
                    fontFamily: "var(--font-dm-mono)",
                    fontWeight: 400,
                    letterSpacing: "0.06em",
                  }}
                  aria-hidden="true"
                >
                  {value.number}
                </span>

                {/* Card title */}
                <h3
                  className="mb-3 text-carbon"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(22px, 4vw, 36px)",
                    fontWeight: 400,
                    lineHeight: 1.15,
                  }}
                >
                  {value.title}
                </h3>

                {/* Card body */}
                <p
                  className="text-ash"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "15px",
                    fontWeight: 300,
                    lineHeight: 1.65,
                  }}
                >
                  {value.body}
                </p>
              </article>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
