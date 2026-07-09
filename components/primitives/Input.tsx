/**
 * Input — brand primitive
 *
 * Wraps the shadcn Input from components/ui/input.tsx and applies
 * brand-specific sizing and font from PROJECT.md § 3.
 *
 * The extra className string here lifts the height from h-8 (shadcn default)
 * to h-11 (44px), which is the minimum comfortable touch target for mobile
 * (90%+ of RogueRoute traffic per PROJECT.md). DM Sans at 14px/500 matches
 * the "UI labels/buttons" spec.
 *
 * Usage:
 *   import { Input } from "@/components/primitives/Input"
 *   <Input type="email" placeholder="your@email.com" />
 */
import { cn } from "@/lib/utils";
import { Input as BaseInput } from "@/components/ui/input";
import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input">;

export function Input({ className, ...props }: InputProps) {
  return (
    <BaseInput
      className={cn(
        // Override: taller touch target (44px), brand font, brand text size
        "h-11 text-sm font-normal text-carbon placeholder:text-ash",
        className
      )}
      {...props}
    />
  );
}
