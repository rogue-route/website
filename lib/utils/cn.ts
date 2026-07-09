/**
 * Re-export cn from the shadcn-generated lib/utils.ts.
 * PROJECT.md specifies lib/utils/cn.ts as the import path for components;
 * shadcn init placed cn in lib/utils.ts — this thin re-export bridges both
 * without duplicating the implementation.
 */
export { cn } from "../utils";
