/**
 * Divider — brand primitive
 *
 * No shadcn equivalent exists for a simple horizontal rule, so this is
 * hand-written. Kept to one element; no logic, no state.
 *
 * Uses --rr-fog (#E4E3DE) via the `border-fog` Tailwind utility, which is
 * the only allowed border color per PROJECT.md § 3.
 *
 * The optional `label` prop renders a centred text label on the divider
 * (e.g. "or") — a common form pattern needed in Phase 2.
 *
 * Usage:
 *   import { Divider } from "@/components/primitives/Divider"
 *   <Divider />
 *   <Divider label="or" />
 */
import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (label) {
    return (
      <div
        role="separator"
        aria-label={label}
        className={cn("flex items-center gap-3", className)}
      >
        <hr className="flex-1 border-t border-fog" />
        <span
          className="shrink-0 text-xs font-medium tracking-[0.06em] text-ash uppercase"
          aria-hidden="true"
        >
          {label}
        </span>
        <hr className="flex-1 border-t border-fog" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={cn("border-t border-fog", className)}
    />
  );
}
