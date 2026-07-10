"use client";
/**
 * QuizOption — Task 4.3
 *
 * A single selectable answer button used inside QuizCard.
 * Renders identically for both single-select and multi-select questions;
 * the parent (QuizCard) controls selection logic.
 *
 * States: default → hover → selected.
 * Selected: Forest Ink fill, True White text — consistent with the only CTA
 * colour rule in PROJECT.md § 3.
 * Default/hover: True White bg, Fog border; hover shifts border to Carbon.
 *
 * Keyboard: uses a <button> element so Tab / Enter / Space work natively.
 * aria-pressed communicates selected state to assistive technology.
 *
 * Why "use client": onClick handler and hover state (CSS handles hover,
 * but onClick is required). Could be a pure server component if we used
 * form actions, but onClick keeps the interaction model simple here.
 */

import { cn } from "@/lib/utils";

interface QuizOptionProps {
  id: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
  /** Disables the option after the stage auto-advances (prevents double-tap). */
  disabled?: boolean;
}

export function QuizOption({
  id,
  label,
  selected,
  onSelect,
  disabled = false,
}: QuizOptionProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={() => onSelect(id)}
      className={cn(
        // Base — full width, left-aligned, comfortable touch target (min 44px)
        "w-full rounded-lg border px-4 py-3 text-left transition-colors",
        "min-h-[44px]", // mobile touch target per AGENTS.md rule 3
        // Typography — DM Sans 14px/500 matches UI label spec in PROJECT.md § 3
        "text-sm font-medium leading-snug",
        // Font applied via inline style to avoid Tailwind purge issues with
        // CSS variable fonts
        // Default state
        "border-fog bg-true-white text-carbon",
        // Hover state (only when not selected and not disabled)
        "hover:border-carbon",
        // Selected state — Forest Ink fill, True White text
        selected && "border-forest-ink bg-forest-ink text-true-white hover:border-forest-ink",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-60",
        // Focus visible — Forest Ink ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-ink focus-visible:ring-offset-2"
      )}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {label}
    </button>
  );
}
