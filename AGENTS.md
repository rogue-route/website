# AGENTS.md — Rules for the AI Coding Agent

You are building **RogueRoute**, a 3-page marketing site for a skincare brand that hasn't launched yet. The founder is non-technical, has almost no budget left, and is directing you through Continue/Copilot in VS Code. Your #1 job is to **not waste their remaining budget on rework**. That means: small steps, working code every step, no scope creep.

Read `PROJECT.md` for the brand/design system and `TASK.md` for the current task list. Always work from the current unchecked task in `TASK.md` — do not jump ahead.

---

## Tech Stack (locked — do not deviate)

- Next.js 15, App Router, TypeScript
- Tailwind CSS
- shadcn/ui (only add components you actually use)
- Framer Motion — **light use only**: quiz card enter/exit, form success checkmark, mobile nav open/close. Nothing else.
- React `useState` / `useReducer` for quiz state — **no Zustand, no external state library**
- Zod for form validation
- Plain CSS / Tailwind for all decorative texture — **no React Bits, no PatternCraft library**. If a section wants a subtle text/scroll effect, write it as a tiny CSS transition or a 10-line Framer Motion variant, not a third-party component library.

## Explicitly cut for v1 (do not build, do not suggest)

- React Bits, PatternCraft
- Zustand or any global state manager
- Dark mode
- Founder bio section, Shopify/Amazon integration, blog engine, product pages, customer accounts
- Any animation that isn't in `PROJECT.md`'s "Phase 1 animation list"

If a task in `TASK.md` seems to require one of these, stop and flag it instead of building it.

## How to work

1. **One task at a time.** Each task in `TASK.md` is sized to be completable and reviewable in one sitting. Do not bundle multiple tasks into one change unless the task list says so.
2. **Always leave the app running.** After every task, the dev server should start with no errors and the page should render — even if unstyled or incomplete. Never leave the build broken between tasks.
3. **Mobile first, always check mobile.** This brand is 90%+ mobile traffic. Build and visually sanity-check every component at a 375px viewport before considering it done. Desktop is secondary.
4. **Use the design tokens, don't invent new ones.** Colors, fonts, spacing all come from `PROJECT.md` → Design System. If you need a value that isn't defined there, ask rather than guessing a new one.
5. **No premature abstraction.** Don't build for the future ecommerce/blog/account pages beyond what's in the folder structure placeholders. Reserve the folders, don't build the features.
6. **Ask before adding a dependency.** Any new npm package beyond what's listed in Tech Stack needs a one-line justification and explicit confirmation before installing.
7. **Forms and data:** for v1, form submissions can hit local API routes that just log/store to a placeholder (see `TASK.md` Phase 5 for when real storage gets wired in). Don't wire up paid services until that phase.
8. **Accessibility isn't optional but isn't gold-plated either.** Every image needs alt text, every input needs a label, every interactive element needs to be keyboard reachable. Skip the full WCAG audit until Phase 6.
9. **When unsure, prefer the boring solution.** Plain Tailwind classes over custom CSS. Native HTML elements over custom-built ones. shadcn's default component over a hand-rolled one.
10. Never modify more than one completed task in a single response.

## Commit / update style

After finishing a task:
- Check the box for that task in `TASK.md`.
- Add one short line under it noting anything that changed from the original plan (e.g. "used a native `<select>` instead of shadcn Select — simpler for this case").
- Don't rewrite `PROJECT.md` unless the founder asks for it — it's the source of truth and should stay stable.

## AI Response Rules

Before writing code:

- Read AGENTS.md
- Read PROJECT.md
- Read TASK.md

Never regenerate files that don't change.

Always reuse existing components.

Always explain WHY you made an architectural decision.

Prefer editing existing code over rewriting files.

If more than 5 files must change, stop and ask for confirmation.

Never create duplicate components.

Never create multiple implementations of the same feature.

Always keep npm dependencies minimal.

Always prefer built-in Next.js functionality before suggesting a library.