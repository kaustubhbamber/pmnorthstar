import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NorthStar — Product Management Resources",
  description: "A curated library of books, case studies, and frameworks for anyone learning product management",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23e02020'/><path d='M16 4l3.7 7.5L28 13l-6 5.8 1.4 8.2L16 23l-7.4 4 1.4-8.2L4 13l8.3-1.5z' fill='white'/></svg>",
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
