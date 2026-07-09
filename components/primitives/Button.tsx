/**
 * Button — brand primitive
 *
 * Re-exports the shadcn Button from components/ui/button.tsx.
 * Brand token mapping lives in globals.css (--primary → Forest Ink, etc.).
 * All dark: variants have been stripped from ui/button.tsx.
 *
 * Usage:
 *   import { Button } from "@/components/primitives/Button"
 *   <Button variant="default">Take the quiz</Button>    ← Forest Ink CTA
 *   <Button variant="outline">Learn more</Button>
 *   <Button variant="secondary">Secondary</Button>      ← Raw Sage
 *   <Button variant="ghost">Cancel</Button>
 *
 * Variants map (from PROJECT.md § 3):
 *   default    → Forest Ink fill (#1C3A2F) — the ONLY CTA color
 *   secondary  → Raw Sage fill (#4A6741)
 *   outline    → Fog border (#E4E3DE), Chalk White background
 *   ghost      → transparent, Fog hover
 */
export { Button, buttonVariants } from "@/components/ui/button";
export type { } from "@/components/ui/button";
