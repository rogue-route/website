/**
 * app/(marketing)/layout.tsx
 * Next.js App Router layout for the marketing route group.
 */
import { MarketingLayout } from "@/components/layouts/MarketingLayout";
import { NavBar } from "@/components/sections/shared/NavBar";

export default function MarketingRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // footer prop omitted — built in Task 1.2
  return <MarketingLayout nav={<NavBar />}>{children}</MarketingLayout>;
}
