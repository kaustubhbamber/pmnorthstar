import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CheckIt, Is your vibe-coded site ready for the business world?",
  description:
    "Free site readiness scorecard. We run 20 checks across brand, performance, SEO, UX, and trust, the basics that decide whether users treat you as a product or a project.",
  openGraph: {
    title: "CheckIt, by northstar",
    description:
      "Paste your URL. Get scored on 20 things across 5 dimensions. Free, no signup.",
    url: "https://pmnorthstar.in/checkit",
    siteName: "northstar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CheckIt, by northstar",
    description:
      "Is your vibe-coded site ready for the business world? Free 20-check scorecard.",
  },
  alternates: {
    canonical: "https://pmnorthstar.in/checkit",
  },
};

export default function CheckItLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
