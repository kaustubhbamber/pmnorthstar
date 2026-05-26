import type { Metadata } from "next";
import CheckItClient from "./CheckItClient";
import { normalizeUrl } from "@/lib/checkit/util";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";

// Generate page-level metadata that overrides the static layout defaults
// when a ?url=X param is present. The OG image URL points at
// /api/checkit/og?url=X which renders a band-colored score card based
// on the most recent audit logged for that host. Social platforms
// (Slack, Twitter, WhatsApp, LinkedIn) fetch the OG image on share, so
// recipients see the score before clicking through.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { url?: string };
}): Promise<Metadata> {
  const raw = searchParams.url?.trim();
  const url = raw ? normalizeUrl(raw) : null;

  if (!url) {
    // No URL in query — fall through to the static layout metadata.
    return {};
  }

  const host = url.hostname;
  const shareUrl = `${SITE_URL}/checkit?url=${encodeURIComponent(raw!)}`;
  const ogImageUrl = `${SITE_URL}/api/checkit/og?url=${encodeURIComponent(raw!)}`;
  const title = `CheckIt scored ${host}`;
  const description = `See how ${host} scored across 35 checks — brand, performance, SEO, UX, trust, polish, and standards. Free 30-second site readiness audit.`;

  return {
    title,
    description,
    alternates: { canonical: shareUrl },
    openGraph: {
      type: "website",
      title,
      description,
      url: shareUrl,
      siteName: "northstar",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `CheckIt score for ${host}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function CheckItPage() {
  return <CheckItClient />;
}
