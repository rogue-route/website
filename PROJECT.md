# PROJECT.md — RogueRoute Source of Truth

This is the merged, final version of the architecture — combining the full design system from the Claude Sonnet architecture doc with the scope-cutting from the DeepSeek review. This is what actually gets built for v1. Anything not in this document is out of scope for now.

---

## 1. What we're building right now

Three pages, no products yet:

1. **Landing page (`/`)** — hero with "Launching Soon", mobile vs desktop hero image, newsletter/waitlist signup, contact form, footer.
2. **About Us (`/about`)** — short brand story, 3–4 value points. No founder section yet.
3. **Skin Quiz (`/quiz`, `/quiz/stage-2`, `/quiz/results`)** — two-stage questionnaire (~13 questions Stage 1 + Stage 2), one question at a time in a floating card, score shown at the end of each stage, all answers stored.

Everything else (products, blog, Shopify, Amazon, accounts, dark mode) is **reserved as empty folders only** — not built.

---

## 2. Design Philosophy

Premium, minimal, clinical-but-warm. Think Aesop / The Ordinary / Nothing — restraint over decoration. No stock photos of smiling people, no emoji in UI, no gradient text, no pop-ups within 3 seconds of landing, no button styles that look like a template default.

Motion should communicate, not decorate. If an animation doesn't help the user understand state (loading, success, progress, transition), it's optional.

Brand Voice: Scientific, Transparent, Evidence-based, Minimal, Unapologitic, Go Rogue!

Never exaggerate. Never promise miracle results.

Never use words like: "magic", "perfect", "instant", "guaranteed"

Instead use: helps, supports, designed for, formulated to

---

## 3. Design System

### Colors

| Role | Name | Hex |
|---|---|---|
| Background | Chalk White | `#F8F7F4` |
| Surface | True White | `#FFFFFF` |
| Text (primary) | Carbon | `#111110` |
| Text (subtle) | Ash | `#6B6B67` |
| Border/divider | Fog | `#E4E3DE` |
| Primary CTA | Forest Ink | `#1C3A2F` |
| Hover/secondary | Raw Sage | `#4A6741` |
| Warm accent (tags) | Parchment | `#C8B89A` |
| Error | Terracotta | `#B85C38` |

Rules: max 3 colors per section. Forest Ink is the only CTA color. Fog is the only border color. No opacity tricks on Carbon — use Ash instead.

### Typography

- **Headlines:** Cormorant Garamond (300/400/600) via `next/font/google`
- **Body/UI:** DM Sans (300/400/500)
- **Data/scores/progress:** DM Mono (400/500)

Mobile-first scale (use Tailwind's `clamp()`-based responsive sizes):
- Hero headline: `clamp(36px, 8vw, 72px)`, weight 300
- Section headline: `clamp(28px, 6vw, 52px)`, weight 400
- Card title: `clamp(22px, 4vw, 36px)`
- Body: 16px / 1.65
- UI labels/buttons: 14px, weight 500, tracked `0.04–0.08em`

### Spacing

8px base grid. Section padding: 64px mobile, 96px desktop. Container max-width 1200px (desktop), 20px side padding on mobile.

---

## 4. Folder structure (build this shape, only fill what's needed for v1)

```
app/
  (marketing)/
    page.tsx              # Landing
    about/page.tsx
    layout.tsx             # Nav + Footer
  (quiz)/
    quiz/page.tsx           # Stage 1
    quiz/stage-2/page.tsx
    quiz/results/page.tsx
    layout.tsx              # Minimal layout, progress bar only
  (shop)/                   # empty — reserved for future
  (account)/                # empty — reserved for future
  (content)/                # empty — reserved for future
  api/
    waitlist/route.ts
    contact/route.ts
    quiz/submit/route.ts

components/
  primitives/        Button, Input, Label, Badge, Divider
  compounds/
    forms/           NewsletterForm, ContactForm, FormField
    quiz/            QuizCard, QuizOption, ProgressIndicator, ScoreDisplay
  sections/
    landing/         HeroSection, LaunchBanner, WaitlistSection, ContactSection
    about/           ManifestoSection, ValuesSection
    shared/          NavBar, Footer
  layouts/           MarketingLayout, QuizLayout

lib/
  quiz/              questions.ts, scoring.ts, types.ts
  validations/       contact.ts, waitlist.ts (Zod schemas)
  hooks/             useQuizState.ts (useReducer-based, not Zustand)
  utils/             cn.ts
  constants/         brand.ts, seo.ts

public/images/       hero-mobile.jpg, hero-desktop.jpg, og-image.jpg
styles/tokens.css     CSS custom properties for the palette above
```

Component tiers (don't mix responsibilities):
- **Primitives** — no logic, just styled shadcn wrappers.
- **Compounds** — local state only, no API calls (e.g. `QuizCard`).
- **Sections** — page-level blocks, may fetch/submit data.

---

## 5. Animation — what actually gets built

Only these get motion in v1:

| Where | What |
|---|---|
| Hero headline | Simple fade/slide-in on load (CSS or 5-line Framer variant) |
| Quiz card | Enter/exit transition between questions (Framer `AnimatePresence`) |
| Score reveal | Count-up number animation |
| Form submit | Success checkmark / inline error state |
| Mobile nav | Slide/fade open-close |

Everything else is static. No scroll-triggered reveals, no parallax, no decorative background patterns for v1.

---

## 6. Page routes

```
/                → Landing (Hero, Launching Soon, Waitlist, Contact, Footer)
/about           → About Us (Manifesto, Values)
/quiz            → Stage 1 (13 questions, one at a time, score at end)
/quiz/stage-2    → Stage 2 (same pattern)
/quiz/results    → Final score + email capture if not already given
```

Reserved for later (folders only, no pages): `/products`, `/collections`, `/blog`, `/learn`, `/account/*`, `/skin-analysis`, `/faq`, `/reviews`, `/policies/*`.

---

## 7. Data & services

- Waitlist submissions are validated by the server and upserted into Supabase by normalized email.
- Brevo creates or updates each Waitlist contact and adds it only to the configured Rogue Route Waitlist list.
- Optional Waitlist founder notifications use Brevo and are controlled by a server-side enable/disable environment flag.
- Contact submissions use Supabase and Brevo through their separate Contact flow.
- Quiz responses are stored in Supabase.
- Privacy-respecting analytics (Plausible or Fathom) remain optional.

---

## 8. What was deliberately cut from the original architecture doc, and why

| Cut | Reason |
|---|---|
| React Bits library | Custom integration cost > visual benefit for MVP; plain CSS/Framer gets 90% of the feel |
| PatternCraft backgrounds | Low impact on mobile (90% of traffic); adds a dependency for something a solid-color section does fine without |
| Zustand | Only 2 quiz stages and no user accounts yet — `useReducer` is enough |
| Dark mode | No one asking for it yet; revisit after traffic validation |
| Founder section, Shopify/Amazon, blog engine | Genuinely future work — folders reserved, nothing built |
| Deep Framer Motion integration | Capped to 5 specific places (see Section 5) instead of "wherever it looks nice" |

Everything else from the original Claude architecture doc (colors, type, spacing, folder shape, accessibility basics, performance targets) is kept — it's free to follow and makes the site look considered rather than templated.
