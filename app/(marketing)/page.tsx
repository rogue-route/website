/**
 * Landing page — Task 2.5
 *
 * Composes all Phase 2 sections:
 *   HeroSection (2.1) → LaunchBanner (2.2) → WaitlistSection (2.3) → ContactSection (2.4)
 *
 * Footer is injected by app/(marketing)/layout.tsx via MarketingLayout.
 *
 * SEO: Next.js App Router `metadata` export. og:image points to
 * public/images/og-image.jpg — reserved in PROJECT.md, drop the file in
 * to activate without any code change.
 */
import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/landing/HeroSection";
import { Introduction } from "@/components/sections/landing/Introduction";
import { LaunchBanner } from "@/components/sections/landing/LaunchBanner";
import { WaitlistSection } from "@/components/sections/landing/WaitlistSection";
import { ContactSection } from "@/components/sections/landing/ContactSection";
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "@/lib/constants/seo";

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RogueRoute — Evidence-based skincare, launching soon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
};

export default function LandingPage() {
  return (
    // Layout owns <main>; page renders sections directly into it.
    <>
      <HeroSection />
      <Introduction />
      {/* <LaunchBanner /> */}
      <WaitlistSection />
      <ContactSection />
    </>
  );
}
