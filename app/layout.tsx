import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { caseStudies } from "@/data/caseStudies";
import { playlists } from "@/data/learn";
import { books } from "@/data/books";
import { ConsentBanner } from "@/components/ConsentBanner";
import "./globals.css";

// Self-hosted fonts via next/font. Eliminates the render-blocking
// fonts.googleapis.com roundtrip that PSI flagged for ~1.9s LCP
// savings. display:swap keeps the page paintable while fonts arrive;
// the metric-similar system-ui fallback prevents visible reflow.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";
const CASE_STUDY_COUNT = caseStudies.length;
const BOOK_COUNT = books.length;
const PLAYLIST_COUNT = playlists.length;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Default home title kept under 60 chars so Bing/Google don't
    // truncate it in SERPs. The longer marketing line lives in the
    // description and OpenGraph blocks below instead.
    default: "northstar: Free Product Management Library",
    template: "%s | northstar",
  },
  // 50-160 chars — Google truncates beyond that in SERPs. Wider context
  // (counts, scope, the "no paywall" angle) lives in OpenGraph below.
  description:
    `Free PM library with ${CASE_STUDY_COUNT} case studies, ${BOOK_COUNT} book reviews, and ${PLAYLIST_COUNT} curated playlists. Hand-picked, opinionated, no paywall.`,
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
    title: "northstar: Free Product Management Library, Case Studies & Playlists",
    description:
      `${BOOK_COUNT} books · ${CASE_STUDY_COUNT} case studies · ${PLAYLIST_COUNT} curated playlists. The free, opinionated library for product managers and builders.`,
  },
  twitter: {
    card: "summary_large_image",
    title: "northstar: Product Management Library",
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
  // Favicon + apple-touch-icon are auto-routed from app/icon.tsx and
  // app/apple-icon.tsx as real PNGs. Don't set `icons` here — that
  // would override the auto-generated tags.
};

// Only set data-theme when the user has explicitly picked a theme.
// CSS handles the no-attribute case via prefers-color-scheme (system
// pref), so first paint is always correct without depending on this
// script running before paint. The script's only job now is to honor
// a user override that disagrees with the OS preference.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
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
        <ConsentBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
