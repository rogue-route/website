/**
 * Badge — brand primitive
 *
 * Wraps the shadcn Badge from components/ui/badge.tsx.
 * An extra "accent" variant was added to ui/badge.tsx for the Parchment
 * warm-tag use case described in PROJECT.md § 3 ("Warm accent (tags)").
 *
 * Variants:
 *   default    → Forest Ink fill — use for status/active states
 *   accent     → Parchment (#C8B89A) — use for brand category tags
 *   outline    → Fog border — use for neutral labels
 *   secondary  → Raw Sage fill
 *   ghost      → transparent, Fog hover — use for inline metadata
 *
 * Usage:
 *   import { Badge } from "@/components/primitives/Badge"
 *   <Badge variant="accent">Hydration</Badge>
 *   <Badge variant="outline">Coming soon</Badge>
 */
export { Badge, badgeVariants } from "@/components/ui/badge";
