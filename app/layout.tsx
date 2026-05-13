import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { caseStudies } from "@/data/caseStudies";
import { playlists } from "@/data/learn";
import { books } from "@/data/books";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.vercel.app";
const CASE_STUDY_COUNT = caseStudies.length;
const BOOK_COUNT = books.length;
const PLAYLIST_COUNT = playlists.length;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "northstar — Free Product Management Library, Case Studies & Playlists",
    template: "%s | northstar",
  },
  description:
    `A free curated library of the best books, case studies, and YouTube playlists for product managers. ${BOOK_COUNT} essential books, ${CASE_STUDY_COUNT} real case studies (Apple, Spotify, Airbnb, Slack, Cred, Razorpay, Zerodha), and ${PLAYLIST_COUNT} hand-picked learning playlists across design, data, marketing, branding, startups and finance.`,
  keywords: [
    "product management",
    "product manager",
    "PM resources",
    "product management books",
    "product case studies",
    "product analytics",
    "design",
    "marketing",
    "startup",
    "branding",
    "data analytics",
    "AI product management",
  ],
  authors: [{ name: "northstar" }],
  creator: "northstar",
  publisher: "northstar",
  category: "education",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "northstar",
    title: "northstar — Free Product Management Library, Case Studies & Playlists",
    description:
      `${BOOK_COUNT} books · ${CASE_STUDY_COUNT} case studies · ${PLAYLIST_COUNT} curated playlists. The free, opinionated library for product managers and builders.`,
  },
  twitter: {
    card: "summary_large_image",
    title: "northstar — Product Management Library",
    description: "Free curated books, case studies and playlists for PMs and builders.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23e02020'/><path d='M16 4l3.7 7.5L28 13l-6 5.8 1.4 8.2L16 23l-7.4 4 1.4-8.2L4 13l8.3-1.5z' fill='white'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="noise">
        {/* Site-wide JSON-LD: WebSite schema for search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "northstar",
              alternateName: "northstar PM",
              url: SITE_URL,
              description:
                "Free curated library of books, case studies, and YouTube playlists for product managers.",
              inLanguage: "en-US",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
