/**
 * Task 0.2 test page — shows every primitive variant.
 * HeroSection (Task 2.1) added above the primitives showcase.
 * This page will be replaced in Task 2.5 when the landing page is assembled.
 */
import { Button }  from "@/components/primitives/Button";
import { Input }   from "@/components/primitives/Input";
import { Label }   from "@/components/primitives/Label";
import { Badge }   from "@/components/primitives/Badge";
import { Divider } from "@/components/primitives/Divider";
import { HeroSection } from "@/components/sections/landing/HeroSection";

export default function PrimitivesTestPage() {
  return (
    // Layout owns <main>; this page renders its content directly into it.
    <div className="bg-chalk-white">
      {/* ── Task 2.1 — Hero section ─────────────────────────────────── */}
      <HeroSection />

      {/* ── Task 0.2 — Primitives showcase (below hero until Task 2.5) ── */}
      <div className="px-5 py-16">
      <div className="mx-auto max-w-[600px] space-y-12">

        {/* Page header */}
        <div>
          <p className="text-xs tracking-[0.08em] uppercase text-ash">
            Task 0.2 — Primitives
          </p>
          <h1
            className="mt-1 text-carbon"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(28px, 6vw, 52px)",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            Component primitives
          </h1>
        </div>

        {/* ── Button ──────────────────────────────── */}
        <section className="space-y-4">
          <p className="text-xs tracking-[0.08em] uppercase text-ash">Button</p>
          <Divider />

          {/* Mobile: stack; desktop: row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button variant="default" size="default">
              Take the quiz
            </Button>
            <Button variant="secondary" size="default">
              Learn more
            </Button>
            <Button variant="outline" size="default">
              View details
            </Button>
            <Button variant="ghost" size="default">
              Cancel
            </Button>
          </div>

          {/* Sizes */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button variant="default" size="sm">Small</Button>
            <Button variant="default" size="default">Default</Button>
            <Button variant="default" size="lg">Large</Button>
          </div>

          {/* States */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button variant="default" disabled>Disabled</Button>
            <Button variant="destructive" size="default">Destructive</Button>
          </div>
        </section>

        {/* ── Label + Input ────────────────────────── */}
        <section className="space-y-4">
          <p className="text-xs tracking-[0.08em] uppercase text-ash">Input + Label</p>
          <Divider />

          <div className="space-y-2">
            <Label htmlFor="email-test">Email address</Label>
            <Input
              id="email-test"
              type="email"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name-test">Full name</Label>
            <Input
              id="name-test"
              type="text"
              placeholder="Jane Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="disabled-test">Disabled field</Label>
            <Input
              id="disabled-test"
              type="text"
              placeholder="Not editable"
              disabled
            />
          </div>
        </section>

        {/* ── Badge ────────────────────────────────── */}
        <section className="space-y-4">
          <p className="text-xs tracking-[0.08em] uppercase text-ash">Badge</p>
          <Divider />

          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Forest Ink</Badge>
            <Badge variant="accent">Parchment tag</Badge>
            <Badge variant="secondary">Raw Sage</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge variant="destructive">Error</Badge>
          </div>
        </section>

        {/* ── Divider ──────────────────────────────── */}
        <section className="space-y-4">
          <p className="text-xs tracking-[0.08em] uppercase text-ash">Divider</p>
          <Divider />
          <Divider label="or" />
          <p className="text-sm text-ash">
            Plain rule above. Labelled rule with “or” above that.
          </p>
        </section>

      </div>
      </div>{/* end px-5 py-16 wrapper */}
    </div>
  );
}
