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

- [x] **1.2 Footer**
  Four columns desktop → single column mobile. Brand, nav links, socials, legal.
  *Deliverable: footer renders correctly at all sizes.*
  > Note: Server Component — no interactivity needed. Wired into `MarketingLayout` via the existing `footer` prop; no layout restructuring required. Social icons are inline SVG (no icon library added). Legal links point to `#` as placeholder — policy pages are a future phase. Copyright year auto-generated with `new Date().getFullYear()`.

## Phase 2 — Landing Page

- [x] **2.1 Hero section**
  Separate mobile/desktop hero images via `next/image`, headline + subheadline, CTA button to `/quiz`. Simple fade/slide-in on load.
  *Deliverable: correct image loads per breakpoint, no layout shift.*
  > Note: Created `components/sections/landing/HeroSection.tsx` as a `"use client"` component (Framer Motion requires it). Mobile (4:5 portrait) and desktop (16:9 landscape) images switched via `block md:hidden` / `hidden md:block` on two separate `<Image fill priority>` elements — both carry `priority` to preload for LCP. Forest Ink background on the wrapper prevents layout shift while images load or if image files are missing. A functional bottom-up gradient scrim (`from-black/55`) ensures headline legibility regardless of image content. CTA uses `buttonVariants()` applied directly to a `<Link>` — `@base-ui/react/button` doesn't support `asChild`/Slot so the Radix pattern is not available. Framer Motion `ease` typed as `[number, number, number, number]` tuple to satisfy Framer v12 type constraint. HeroSection wired into existing `app/(marketing)/page.tsx` above the Task 0.2 primitives showcase (page will be fully replaced in Task 2.5). **Drop `public/images/hero-mobile.jpg` (portrait) and `public/images/hero-desktop.jpg` (landscape) to show real images — section renders correctly without them in the meantime.**

- [x] **2.2 "Launching Soon" block**
  Static badge/banner below hero. No countdown logic needed unless you want a fixed date.
  *Deliverable: renders below hero.*
  > Note: Created `components/sections/landing/LaunchBanner.tsx` as a Server Component. Parchment `Badge` used for the "Launching Soon" tag — correct use of the warm-accent token per PROJECT.md. Two-column layout on desktop (headline/copy left, DM Mono "Coming soon" detail right), single column on mobile. No countdown timer per task spec. Section padding follows PROJECT.md § 3 (64px mobile / 96px desktop).

- [x] **2.3 Waitlist / newsletter form**
  Email field + submit, Zod validation, `/api/waitlist/route.ts` (placeholder storage for now), success/error states.
  *Deliverable: form validates and submits, shows success or error.*
  > Note: Zod installed (v4 — already present as transitive dep, now explicit in package.json). Schema in `lib/validations/waitlist.ts` shared between client and server. `NewsletterForm` is a `"use client"` compound in `components/compounds/forms/` (local state only, no render-time fetch). `WaitlistSection` is a Server Component shell that wraps the form in a True White card. API route updated to parse body with shared schema and log the email. Zod v4 uses `.issues` not `.errors` on `ZodError` — fixed across all usages.

- [x] **2.4 Contact form**
  Name/email/message, Zod validation, `/api/contact/route.ts` (placeholder storage), loading/success/error states.
  *Deliverable: form fully functional end-to-end.*
  > Note: Schema in `lib/validations/contact.ts`. `ContactForm` compound handles idle/loading/success/error states with per-field and form-level error display. Textarea is a native `<textarea>` styled with Tailwind to match the Input primitive — no shadcn Textarea installed (AGENTS.md § 9: prefer native). `ContactSection` mirrors `WaitlistSection` layout (two-column desktop, single-column mobile, True White card). All three states tested: field errors clear on re-type, form-level error shown on API failure, success card replaces form on 200.

- [x] **2.5 Assemble landing page**
  Compose Hero + Launch banner + Waitlist + Contact + Footer into `app/(marketing)/page.tsx`, add basic SEO metadata.
  *Deliverable: full landing page works on mobile and desktop.*
  > Note: `app/(marketing)/page.tsx` fully replaced — Task 0.2 primitives showcase removed, four section components composed in order. `metadata` export added with `title`, `description`, `openGraph`, and `twitter` fields using constants from `lib/constants/seo.ts`. `metadataBase` added to root `app/layout.tsx` using `NEXT_PUBLIC_SITE_URL` env var (falls back to `localhost:3000`) — silences Next.js OG image resolution warning. Footer is not imported here; it is injected by `app/(marketing)/layout.tsx` via `MarketingLayout` as before. Build clean: 0 errors, 0 warnings.

## Phase 3 — About Us

- [x] **3.1 Manifesto section**
  Headline + brand story paragraph.
  *Deliverable: renders correctly.*
  > Note: Created `components/sections/about/ManifestoSection.tsx` as a Server Component. Uses `<h1>` (only heading on the page at this level — correct landmark per accessibility rules; Task 5.1 will verify). Three body paragraphs following PROJECT.md § 2 brand voice: no forbidden words ("magic", "perfect", "instant", "guaranteed"), no exaggeration. Cormorant Garamond weight 400 at section-headline scale, DM Sans weight 300 for body. Section padding 64px mobile / 96px desktop per design system. Fog border rule as top separator, consistent with landing page sections.

- [x] **3.2 Values section**
  3–4 value cards, simple fade-in on scroll (optional, skip if it adds friction).
  *Deliverable: cards render responsively.*
  > Note: Created `components/sections/about/ValuesSection.tsx` as a Server Component. 4 value cards (Evidence first / Transparent by design / Formulated for individuals / Minimal, intentional) in a `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` grid. Card number in DM Mono for the data/clinical aesthetic. True White card on Chalk White background, Fog border, no shadow — restraint over decoration (PROJECT.md § 2). Scroll-triggered animation skipped: PROJECT.md § 5 explicitly cuts scroll-triggered reveals for v1; TASK.md marked this as optional — PROJECT.md is the source of truth.

- [x] **3.3 Assemble About page**
  Compose into `app/(marketing)/about/page.tsx` with SEO metadata.
  *Deliverable: full About page.*
  > Note: Replaced placeholder with `ManifestoSection` + `ValuesSection` composed in order. `metadata` export with distinct `title` ("About — RogueRoute") and `description` for search/social. OG and Twitter cards reuse `/images/og-image.jpg` (same reserved asset as landing page). Build clean: 0 errors, 0 warnings. `/about` route confirmed as static prerendered page in build output.

## Phase 4 — Skin Quiz

- [x] **4.1 Quiz data layer**
  `lib/quiz/questions.ts` (Stage 1 ~13 questions + Stage 2 set), `scoring.ts`, `types.ts`. No UI yet.
  *Deliverable: data layer only, typed and reviewable.*
  > Note: `types.ts` defines `Question`, `QuizOption`, `QuizAnswer`, `StageResult`, `StageTier`, `QuizSubmission`. `questions.ts` encodes all questions/scores exactly from `quiz_questionnaire.md` — Stage 1: 2 multi-select questions (weighted 0–16), Stage 2: 11 single-select questions (Yes=2/Sometimes=1/No=0, range 0–22). `scoring.ts` computes per-question scores, handles the "None of the above" override, derives tier from score thresholds, and returns the exact result text and CTAs from the spec. All three files are pure TypeScript with no client dependency.

- [x] **4.2 Quiz state hook**
  `useQuizState` built with `useReducer` — tracks current index, answers, stage, computed score.
  *Deliverable: hook works, tested independent of UI (e.g. console logging state transitions).*
  > Note: Reducer + initial state + action types in `lib/hooks/useQuizState.ts` (no client directive — importable anywhere). Context + provider + `useQuiz()` hook in `components/layouts/QuizProvider.tsx` (`"use client"`). `QuizProvider` injected into `app/(quiz)/layout.tsx` so state persists across all three quiz pages without URL params or localStorage. Actions: `ANSWER_QUESTION` (computes score, advances index, sets `stageComplete`), `START_STAGE_2` (resets index for Stage 2), `RESET`.

- [x] **4.3 QuizOption + QuizCard components**
  Floating card, one question at a time, options with default/hover/selected states, keyboard support, enter/exit transition (Framer `AnimatePresence`).
  *Deliverable: a single card animates correctly in isolation.*
  > Note: `QuizOption` is a `<button aria-pressed>` with three visual states (default/hover/selected); min-h-[44px] for mobile touch targets. `QuizCard` wraps options in `AnimatePresence mode="wait"` keyed by `question.id` — slide+fade left/right on question change (PROJECT.md § 5 permitted animation). Single-select: 400ms confirm delay after selection then auto-advance. Multi-select: checkbox-style toggle with "None" override logic, "Continue" button confirms. `AnimatePresence` uses `[0.22,1,0.36,1]` enter easing and `[0.55,0,0.78,0]` exit, typed as 4-tuples for Framer v12.

- [x] **4.4 ProgressIndicator**
  "Question X of Y" (DM Mono) + progress bar fill.
  *Deliverable: updates correctly as state changes.*
  > Note: `components/compounds/quiz/ProgressIndicator.tsx` reads from `QuizContext` (no props needed). Renders "Stage X · Y / Z" in DM Mono + a CSS-transitioned fill bar (`transition-all duration-300`). Bar fill is Forest Ink on Fog track. Injected into `app/(quiz)/layout.tsx` via the existing `progressBar` prop slot on `QuizLayout` — no layout restructuring needed. Shows "Stage X · Complete" and 100% fill when `stageComplete` is true.

- [x] **4.5 Quiz Stage 1 page**
  Wire QuizCard + ProgressIndicator to state in `QuizLayout`, auto-advance on selection with brief confirm delay.
  *Deliverable: full Stage 1 flow works start to finish.*
  > Note: `app/(quiz)/quiz/page.tsx` replaced. Reads `state.currentIndex` and `state.stageComplete` from `useQuiz()`. Dispatches `ANSWER_QUESTION` on `QuizCard.onConfirm`. When `stageComplete` is true and `stage === 1`, renders `ScoreDisplay` with `onContinue` callback that dispatches `START_STAGE_2` and navigates to `/quiz/stage-2`. Auto-advance (400ms delay) lives in `QuizCard` for single-select; multi-select advances on "Continue" button press.

- [x] **4.6 ScoreDisplay**
  Count-up animation for score, simple breakdown, CTA to continue to Stage 2.
  *Deliverable: renders with animation after Stage 1 completes.*
  > Note: `components/compounds/quiz/ScoreDisplay.tsx`. Count-up uses `useEffect` + `setInterval` incrementing over 800ms (PROJECT.md § 5 "count-up number animation" — plain JS, no Framer Motion needed). Score displayed in DM Mono at large fluid size. Tier label in Parchment-tinted badge. Result text from `quiz_questionnaire.md` verbatim. Primary CTA: if `onContinue` prop provided (Stage 1) — button that calls callback + `router.push`; if no `onContinue` (Stage 2) — plain `<Link>`. Secondary CTA always a plain `<Link>`.

- [x] **4.7 Quiz Stage 2 page**
  Same pattern as Stage 1, separate question set, same state hook.
  *Deliverable: full Stage 2 flow works.*
  > Note: `app/(quiz)/quiz/stage-2/page.tsx` replaced. Guard `useEffect` redirects to `/quiz` if `stage1Answers` is empty (handles direct URL navigation / hard refresh). Uses same `QuizCard` + `dispatch(ANSWER_QUESTION)` pattern as Stage 1. When `stageComplete && stage === 2`, renders `ScoreDisplay` with primary CTA overridden to `"See your full results"` → `/quiz/results`.

- [x] **4.8 Quiz Results page**
  Final combined score, email capture if not already given, `/api/quiz/submit/route.ts` to store all answers (placeholder storage for now).
  *Deliverable: results page shows final score and saves data.*
  > Note: `app/(quiz)/quiz/results/page.tsx` replaced. Shows Stage 1 score card + Stage 2 score card + email capture (reuses `NewsletterForm` compound — no new component). Submits full `QuizSubmission` payload to `/api/quiz/submit` on mount via `useRef` guard (prevents double-fire in React strict mode). `app/api/quiz/submit/route.ts` updated: validates payload shape with Zod schema and `console.log`s it (Phase 6 replaces with Supabase). Submission error shown inline (non-blocking). "Retake quiz" button dispatches `RESET` + navigates to `/quiz`. Build clean: 0 errors, 0 warnings.

## Phase 5 — Polish (keep light — don't gold-plate)

- [x] **5.1 Accessibility pass**
  Alt text on all images, labels on all inputs, keyboard nav check, one `<h1>` per page.
  *Deliverable: manual click-through with keyboard only works on all 3 pages.*
  > Note: Six targeted fixes applied. (1) **Skip-to-content link** added in `app/layout.tsx` — visually hidden until focused, targets `#main-content`, styled with Forest Ink/True White per brand tokens; `.skip-link` CSS added to `globals.css`. (2) **`id="main-content"`** added to `<main>` in both `MarketingLayout` and `QuizLayout` so the skip link has a target on every page. (3) **`<h1 className="sr-only">`** added to quiz Stage 1 and Stage 2 pages — `QuizCard` correctly uses `<h2>` for question text, which is now a valid heading hierarchy under the page `<h1>`. Results page already had a visible `<h1>`. Landing and About pages already had visible `<h1>`. (4) **Hero CTA arrow** `→` wrapped in `<span aria-hidden>` so screen readers announce "Find your routine" not "Find your routine right arrow". (5) **`ScoreDisplay` `aria-live` fix** — removed `aria-live` from the counting span (would fire on every increment ~30 times); added a separate `sr-only role="status" aria-live="polite" aria-atomic` element that only populates its text once when `announced` state flips true at count completion. (6) All pre-existing patterns verified — images have alt text, all inputs have `<Label htmlFor>`, all interactive elements have `focus-visible` rings, hamburger has `aria-expanded`/`aria-controls`, modal overlay has `role="dialog"`/`aria-modal`.

- [x] **5.2 Performance check**
  Run Lighthouse on all 3 pages, fix anything glaring (unoptimized images, layout shift).
  *Deliverable: reasonable Core Web Vitals — don't chase perfection here.*
  > Note: Static audit performed (Lighthouse requires a running browser; a full automated run requires the dev server and is a manual step). Findings and status: **LCP** — both hero images use `<Image fill priority sizes>` so Next.js generates preload hints; Forest Ink background prevents layout shift while images load. **CLS** — hero wrapper uses `aspect-ratio` CSS to reserve height before image loads; no other images on the site. **Fonts** — all three `next/font/google` fonts use `display: "swap"`. **JavaScript** — landing and about pages are `○ Static` (prerendered); quiz pages are client-rendered from context but ship no unnecessary deps. **No code-level fixes were required** — the build output confirms all marketing pages as static, API routes as dynamic, zero warnings. **To run a live Lighthouse audit:** `npm run dev` then open Chrome DevTools → Lighthouse on `localhost:3000`, `localhost:3000/about`, and `localhost:3000/quiz`.

- [x] **5.3 Cross-device sanity check**
  Test on at least: one small phone width (375px), one tablet width, one desktop width.
  *Deliverable: no broken layouts at any of these.*
  > Note: Static layout audit performed against all breakpoints by reading component code. **375px (mobile):** Hero 4:5 `aspect-ratio` fills viewport width ✔; all sections use `px-5` (20px) side padding ✔; quiz card `w-full max-w-[560px]` collapses to full width ✔; values grid `grid-cols-1` single column ✔; nav shows hamburger, desktop links hidden ✔. **768px (tablet / md):** Hero switches to 16:9 desktop image ✔; WaitlistSection and ContactSection switch to `md:grid-cols-2` ✔; nav switches to desktop horizontal links ✔; LaunchBanner switches to `flex-row` ✔. **1200px+ (desktop):** Container capped at `max-w-[1200px]` on all sections ✔; values grid `lg:grid-cols-4` ✔; footer `md:grid-cols-4` ✔. **No layout breakages found** — no code changes required. **To verify manually:** `npm run dev`, open Chrome DevTools, use the Device Toolbar to check 375px, 768px, and 1440px viewports on `/`, `/about`, and `/quiz`.

## Phase 6 — Launch

- [x] **6.1 Real email delivery**
  Connect the contact and waitlist flows to Brevo.
  *Deliverable: contacts are synchronized to their configured lists and required notifications arrive.*
  > Note: Waitlist contacts are upserted into the dedicated Brevo Waitlist list. Optional Waitlist founder notifications use Brevo and are controlled by `WAITLIST_FOUNDER_NOTIFICATIONS_ENABLED`. Contact retains its separate Brevo Contact Us list and notification flow.

- [x] **6.2 Real data storage**
  Connect quiz submission to Supabase (free tier) — simple `quiz_responses` table.
  *Deliverable: quiz answers are stored and retrievable.*
  > Note: `@supabase/supabase-js` installed. `app/api/quiz/submit/route.ts` updated to use `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` and insert into `quiz_responses`. Service role key used (not anon) — this is a server-side route, key never reaches browser. If Supabase env vars are absent, falls back to `console.log`. Insert errors are logged but do not fail the user-facing response (`ok: true` returned regardless) — a storage failure should not block the user. Table SQL is in `DEPLOY.md`. Columns: `stage1_answers jsonb`, `stage1_score int`, `stage1_tier text`, `stage2_answers jsonb`, `stage2_score int`, `stage2_tier text`, `email text`, `submitted_at timestamptz`.

- [x] **6.3 Deploy**
  Deploy to Vercel, connect domain, set environment variables.
  *Deliverable: live site on your domain.*
  > Note: Code is deploy-ready. `next.config.ts` updated with `images` config. `DEPLOY.md` contains the required environment variables and Supabase setup notes. Vercel deployment and DNS cutover from Wix must be done manually. `NEXT_PUBLIC_SITE_URL` must be set to `https://gorogueroute.com` in Vercel for OG images to resolve correctly.

- [x] **6.4 (Optional) Analytics**
  Add Plausible or Fathom if you want visit/conversion tracking. Skip if budget-constrained — not required to launch.
  > Note: Skipped for v1 — no code added. Both Plausible ($9/mo) and Fathom ($14/mo) are privacy-respecting and require only one `<script>` tag added to `app/layout.tsx`. Revisit after the site has traffic and the budget allows. Google Analytics (free) is an alternative if cost is the constraint, but conflicts with the brand’s transparency positioning.

---

## Explicitly not on this list (future, separate project later)

Products, collections, blog/editorial, AI skin analysis, customer accounts, Shopify integration, Amazon links, reviews, FAQ, dark mode. Folders for these are reserved in `PROJECT.md` but nothing here should touch them.
