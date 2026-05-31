import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { publishedCaseStudies } from "@/data/caseStudies";
import { books } from "@/data/books";
import { playlists } from "@/data/learn";

export const alt = "northstar — free product management library";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const caseStudiesCount = publishedCaseStudies().length;
  const booksCount = books.length;
  const playlistsCount = playlists.length;

  return ogImage({
    eyebrow: "Free PM Library",
    title: "northstar",
    subtitle: "Books · Case studies · Playlists",
    description: `${caseStudiesCount} long-form case studies, ${booksCount} essential book reviews, and ${playlistsCount} curated playlists for product managers, founders, and operators. No paywall.`,
  });
}
