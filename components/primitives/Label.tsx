/**
 * Label — brand primitive
 *
 * Wraps the shadcn Label from components/ui/label.tsx and applies
 * brand typography: DM Sans 14px / weight 500 / tracking 0.04em.
 * This matches the "UI labels/buttons" scale in PROJECT.md § 3.
 *
 * Usage:
 *   import { Label } from "@/components/primitives/Label"
 *   <Label htmlFor="email">Email address</Label>
 */
import { cn } from "@/lib/utils";
import { Label as BaseLabel } from "@/components/ui/label";
import type { ComponentProps } from "react";

type LabelProps = ComponentProps<"label">;

export function Label({ className, ...props }: LabelProps) {
  return (
    <BaseLabel
      className={cn(
        // Brand: DM Sans 14px 500, tracking 0.04em, Carbon text
        "text-sm font-medium tracking-[0.04em] text-carbon",
        className
      )}
      {...props}
    />
  );
}
