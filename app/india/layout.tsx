import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";

export const metadata: Metadata = {
  title: "Product Management for Builders in India",
  description:
    "A free, curated library of books, case studies, and YouTube playlists for product managers, founders, and operators building in India. Hand-picked. No paywall. No newsletter wall.",
  keywords: [
    "product management India",
    "Indian product manager",
    "product management resources India",
    "Indian startup case studies",
    "PM India",
    "product manager India",
    "Indian unicorn case studies",
    "Cred case study",
    "Razorpay case study",
    "Zerodha case study",
    "Indian product strategy",
    "PM resources for Indians",
  ],
  alternates: { canonical: `${SITE_URL}/india` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/india`,
    siteName: "northstar",
    title: "Product Management for Builders in India — northstar",
    description:
      "Free, curated PM library. Books, case studies, and playlists for builders in India.",
  },
  twitter: {
    card: "summary_large_image",
    title: "northstar — PM Resources for India",
    description: "Free, curated PM library. Built for builders in India.",
  },
};

export default function IndiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Product Management for Builders in India",
            description:
              "A curated library of books, case studies, and YouTube playlists for product managers and builders in India.",
            url: `${SITE_URL}/india`,
            isPartOf: {
              "@type": "WebSite",
              name: "northstar",
              url: SITE_URL,
            },
            inLanguage: "en-IN",
            audience: {
              "@type": "Audience",
              audienceType: "Product Managers, Founders, and Builders in India",
              geographicArea: {
                "@type": "Country",
                name: "India",
              },
            },
          }),
        }}
      />
      {children}
    </>
  );
}
