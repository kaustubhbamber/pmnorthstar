import { getComparisonBySlug } from "@/data/comparisons";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "northstar comparison";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const cmp = getComparisonBySlug(params.slug);
  if (!cmp) {
    return ogImage({
      eyebrow: "Comparison",
      title: "Comparison not found",
    });
  }
  return ogImage({
    eyebrow: "Comparison",
    title: cmp.title,
    subtitle: cmp.eyebrow,
    description: cmp.intro,
  });
}
