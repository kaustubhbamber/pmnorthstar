import {
  getCaseStudyById,
  getCaseStudyBySlug,
  isLegacyId,
} from "@/data/caseStudies";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "northstar case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { id: string };
}) {
  const study =
    getCaseStudyBySlug(params.id) ||
    (isLegacyId(params.id) ? getCaseStudyById(params.id) : undefined);

  if (!study) {
    return ogImage({
      eyebrow: "Case Study",
      title: "Case study not found",
    });
  }
  return ogImage({
    eyebrow: `Case Study · ${study.category}`,
    title: study.title,
    description: study.description,
  });
}
