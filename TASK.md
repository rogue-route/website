# TASK.md — RogueRoute Build Roadmap

Work top to bottom. Check a box only when the deliverable actually renders/works — not when the code is "mostly there." Each task is meant to be small enough to finish and verify in one session.

---

## Phase 0 — Foundation

- [x] **0.1 Project bootstrap**
  Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui installed and configured. `next/font` set up for Cormorant Garamond, DM Sans, DM Mono. `styles/tokens.css` created with the color variables from `PROJECT.md`.
  *Deliverable: blank app runs locally, fonts and colors visibly applied on a test page.*
  > Note: `create-next-app` installed Next.js 16.2.10 (latest stable, labelled "15" in the task but 16 is the current release — same App Router architecture, no rework needed). Tailwind v4 was installed (not v3); token configuration uses `@theme inline` in `globals.css` instead of `tailwind.config.ts` — this is the v4 idiomatic approach. Dark mode `.dark` block removed from `globals.css` as it is cut for v1. All 9 color tokens mapped through `styles/tokens.css` → `globals.css` → Tailwind utilities. Full folder structure from `PROJECT.md` created with placeholder stubs.

- [x] **0.2 Primitives**
  Build `Button` (primary/secondary/ghost/outline), `Input`, `Label`, `Badge`, `Divider` as brand-wrapped shadcn components.
  *Deliverable: one test page showing every variant of each.*
  > Note: shadcn `base-nova` style was already installed (not the default `new-york`); primitives in `components/primitives/` are thin wrappers/re-exports over `components/ui/` rather than reimplementations — avoids duplicate logic if shadcn regenerates ui files. All `dark:` Tailwind variants stripped from generated ui files (dark mode cut for v1). Added `accent` variant to Badge for the Parchment warm-tag use case from PROJECT.md. Input height overridden to 44px (h-11) for mobile touch target compliance. Test page at `/` updated to show all variants.

- [x] **0.3 Layouts**
  `MarketingLayout` (Nav slot + Footer slot + main) and `QuizLayout` (progress bar + main, no nav).
  *Deliverable: two empty layouts rendering correctly on mobile (375px) and desktop.*
  > Note: Layout components live in `components/layouts/` and are imported by the App Router `layout.tsx` files in each route group — keeps Next.js infrastructure separate from visual structure. Nav/Footer/ProgressBar are accepted as optional props so Tasks 1.1, 1.2, and 4.4 can inject real components without editing layout files. All placeholder pages had their `<main>` wrapper swapped to `<div>` — layouts now own the single `<main>` landmark per page (accessibility requirement). QuizLayout uses True White background and reserves a 48px top strip for the progress bar. MarketingLayout uses `flex min-h-screen flex-col` to ensure footer is always at page bottom.

## Phase 1 — Shared chrome

- [x] **1.1 NavBar**
  Desktop horizontal nav, mobile hamburger → full-screen overlay (Framer Motion open/close). Static (non-scroll-reactive) is fine for v1.
  *Deliverable: nav works on all breakpoints.*
  > Note: Framer Motion installed (pre-authorised in tech stack). NavBar is a `"use client"` component wired into `MarketingLayout` via the existing `nav` prop — no layout file restructuring needed. Mobile overlay uses `AnimatePresence` with a 5-line fade/slide variant (PROJECT.md § 5 spec). Hamburger icon morphs to X via pure CSS transforms (no second icon set needed). Body scroll lock implemented with a `useEffect` toggling `overflow-hidden` on `document.body` — no library. Nav links: Home, About + a Forest Ink CTA to `/quiz`.

- [ ] **1.2 Footer**
  Four columns desktop → single column mobile. Brand, nav links, socials, legal.
  *Deliverable: footer renders correctly at all sizes.*

## Phase 2 — Landing Page

- [ ] **2.1 Hero section**
  Separate mobile/desktop hero images via `next/image`, headline + subheadline, CTA button to `/quiz`. Simple fade/slide-in on load.
  *Deliverable: correct image loads per breakpoint, no layout shift.*

- [ ] **2.2 "Launching Soon" block**
  Static badge/banner below hero. No countdown logic needed unless you want a fixed date.
  *Deliverable: renders below hero.*

- [ ] **2.3 Waitlist / newsletter form**
  Email field + submit, Zod validation, `/api/waitlist/route.ts` (placeholder storage for now), success/error states.
  *Deliverable: form validates and submits, shows success or error.*

- [ ] **2.4 Contact form**
  Name/email/message, Zod validation, `/api/contact/route.ts` (placeholder storage), loading/success/error states.
  *Deliverable: form fully functional end-to-end.*

- [ ] **2.5 Assemble landing page**
  Compose Hero + Launch banner + Waitlist + Contact + Footer into `app/(marketing)/page.tsx`, add basic SEO metadata.
  *Deliverable: full landing page works on mobile and desktop.*

## Phase 3 — About Us

- [ ] **3.1 Manifesto section**
  Headline + brand story paragraph.
  *Deliverable: renders correctly.*

- [ ] **3.2 Values section**
  3–4 value cards, simple fade-in on scroll (optional, skip if it adds friction).
  *Deliverable: cards render responsively.*

- [ ] **3.3 Assemble About page**
  Compose into `app/(marketing)/about/page.tsx` with SEO metadata.
  *Deliverable: full About page.*

## Phase 4 — Skin Quiz

- [ ] **4.1 Quiz data layer**
  `lib/quiz/questions.ts` (Stage 1 ~13 questions + Stage 2 set), `scoring.ts`, `types.ts`. No UI yet.
  *Deliverable: data layer only, typed and reviewable.*

- [ ] **4.2 Quiz state hook**
  `useQuizState` built with `useReducer` — tracks current index, answers, stage, computed score.
  *Deliverable: hook works, tested independent of UI (e.g. console logging state transitions).*

- [ ] **4.3 QuizOption + QuizCard components**
  Floating card, one question at a time, options with default/hover/selected states, keyboard support, enter/exit transition (Framer `AnimatePresence`).
  *Deliverable: a single card animates correctly in isolation.*

- [ ] **4.4 ProgressIndicator**
  "Question X of Y" (DM Mono) + progress bar fill.
  *Deliverable: updates correctly as state changes.*

- [ ] **4.5 Quiz Stage 1 page**
  Wire QuizCard + ProgressIndicator to state in `QuizLayout`, auto-advance on selection with brief confirm delay.
  *Deliverable: full Stage 1 flow works start to finish.*

- [ ] **4.6 ScoreDisplay**
  Count-up animation for score, simple breakdown, CTA to continue to Stage 2.
  *Deliverable: renders with animation after Stage 1 completes.*

- [ ] **4.7 Quiz Stage 2 page**
  Same pattern as Stage 1, separate question set, same state hook.
  *Deliverable: full Stage 2 flow works.*

- [ ] **4.8 Quiz Results page**
  Final combined score, email capture if not already given, `/api/quiz/submit/route.ts` to store all answers (placeholder storage for now).
  *Deliverable: results page shows final score and saves data.*

## Phase 5 — Polish (keep light — don't gold-plate)

- [ ] **5.1 Accessibility pass**
  Alt text on all images, labels on all inputs, keyboard nav check, one `<h1>` per page.
  *Deliverable: manual click-through with keyboard only works on all 3 pages.*

- [ ] **5.2 Performance check**
  Run Lighthouse on all 3 pages, fix anything glaring (unoptimized images, layout shift).
  *Deliverable: reasonable Core Web Vitals — don't chase perfection here.*

- [ ] **5.3 Cross-device sanity check**
  Test on at least: one small phone width (375px), one tablet width, one desktop width.
  *Deliverable: no broken layouts at any of these.*

## Phase 6 — Launch

- [ ] **6.1 Real email delivery**
  Connect waitlist + contact forms to Resend (free tier).
  *Deliverable: real emails arrive.*

- [ ] **6.2 Real data storage**
  Connect quiz submission to Supabase (free tier) — simple `quiz_responses` table.
  *Deliverable: quiz answers are stored and retrievable.*

- [ ] **6.3 Deploy**
  Deploy to Vercel, connect domain, set environment variables.
  *Deliverable: live site on your domain.*

- [ ] **6.4 (Optional) Analytics**
  Add Plausible or Fathom if you want visit/conversion tracking. Skip if budget-constrained — not required to launch.

---

## Explicitly not on this list (future, separate project later)

Products, collections, blog/editorial, AI skin analysis, customer accounts, Shopify integration, Amazon links, reviews, FAQ, dark mode. Folders for these are reserved in `PROJECT.md` but nothing here should touch them.
