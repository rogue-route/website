import SplitFlapText from "@/components/primitives/SplitFlapText";

export function LaunchBannerFooter() {
  return (
    <section aria-label="Launch announcement" className="w-full bg-chalk-white">
      <div className="w-full px-5 py-16 md:px-10 md:py-18 lg:px-16 lg:py-22">
        {/* Thin top rule — separates this section from whatever sits above it */}
        <div className="flex justify-center border-t border-fog pt-10 md:pt-12">
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
            fontSize="clamp(32px, 3.5vw, 76px)"
            loop
            padTo={12}
          />
        </div>
      </div>
    </section>
  );
}