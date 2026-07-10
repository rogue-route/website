/**
 * app/(marketing)/layout.tsx
 * Next.js App Router layout for the marketing route group.
 */
import { MarketingLayout } from "@/components/layouts/MarketingLayout";
import { NavBar } from "@/components/sections/shared/NavBar";
import { Footer } from "@/components/sections/shared/Footer";

export default function MarketingRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingLayout nav={<NavBar />} footer={<Footer />}>
      {children}
    </MarketingLayout>
  );
}
