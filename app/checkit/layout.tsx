import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";
const DEFAULT_OG = `${SITE_URL}/api/checkit/og`;

export const metadata: Metadata = {
  title: "CheckIt: Is your vibe-coded site ready for the business world?",
  description:
    "Free site readiness scorecard. We run 35 weighted checks across brand, performance, SEO, UX, trust, polish, and standards — the basics that decide whether users treat you as a product or a project.",
  openGraph: {
    title: "CheckIt by northstar",
    description:
      "Paste your URL. Get scored on 35 weighted checks across 7 dimensions. Free, no signup.",
    url: `${SITE_URL}/checkit`,
    siteName: "northstar",
    type: "website",
    images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: "CheckIt by northstar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CheckIt by northstar",
    description:
      "Is your vibe-coded site ready for the business world? Free 35-check weighted scorecard.",
    images: [DEFAULT_OG],
  },
  alternates: {
    canonical: `${SITE_URL}/checkit`,
  },
};

export default function CheckItLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
