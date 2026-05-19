import { getTopicBySlug } from "@/data/topics";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const alt = "northstar topic";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const topic = getTopicBySlug(params.slug);
  if (!topic) {
    return ogImage({
      eyebrow: "Topic",
      title: "Topic not found",
    });
  }
  return ogImage({
    eyebrow: "Topic",
    title: topic.title,
    subtitle: topic.eyebrow,
    description: topic.intro,
  });
}
