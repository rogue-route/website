/**
 * About page — Task 3.3
 *
 * Composes Phase 3 sections:
 *   ManifestoSection (3.1) → ValuesSection (3.2)
 *
 * SEO: page-level `metadata` export with a distinct title and description
 * so the About page has its own identity in search results / social shares.
 * metadataBase is set on the root layout; og:image reuses the shared asset.
 */
import type { Metadata } from "next";
import { ManifestoSection } from "@/components/sections/about/ManifestoSection";
import { ValuesSection } from "@/components/sections/about/ValuesSection";

export const metadata: Metadata = {
  title: "About — RogueRoute",
  description:
    "RogueRoute is built on evidence, not expectation. Learn how we formulate skincare and the four principles we don't compromise on.",
  openGraph: {
    title: "About — RogueRoute",
    description:
      "RogueRoute is built on evidence, not expectation. Learn how we formulate skincare and the four principles we don't compromise on.",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RogueRoute — Evidence-based skincare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — RogueRoute",
    description:
      "RogueRoute is built on evidence, not expectation. Learn how we formulate skincare and the four principles we don't compromise on.",
    images: ["/images/og-image.jpg"],
  },
};

export default function AboutPage() {
  return (
    // Layout owns <main>; page renders sections directly into it.
    <>
      <ManifestoSection />
      <ValuesSection />
    </>
  );
}
