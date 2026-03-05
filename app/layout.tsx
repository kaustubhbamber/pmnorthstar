import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NorthStar — PM Resource Hub",
  description: "Curated books and resources for Product Managers, Founders, and Leaders",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⭐</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="noise">{children}</body>
    </html>
  );
}
