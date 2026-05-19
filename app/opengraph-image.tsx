import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "northstar — free product management library";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return ogImage({
    eyebrow: "Free PM Library",
    title: "northstar",
    subtitle: "Books · Case studies · Playlists",
    description:
      "65 long-form case studies, 30 essential book reviews, and 18 curated playlists for product managers, founders, and operators. No paywall.",
  });
}
