import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getDrillBySlug } from "@/data/drills";

// Static branded OG card for the bare drill link (what the launch post
// and any plain share point at). The per-score result card lives on the
// /result share route so this page can stay statically generated.

export const alt = "northstar SimulateIt drill";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const TYPE_LABEL: Record<string, string> = {
  historical: "Historical",
  current: "Current",
  hypothetical: "Hypothetical",
};

function drillTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Image({ params }: { params: { slug: string } }) {
  const drill = getDrillBySlug(params.slug);
  if (!drill) {
    return ogImage({ eyebrow: "SimulateIt", title: "Drill not found" });
  }
  return ogImage({
    eyebrow: `SimulateIt · ${TYPE_LABEL[drill.type] || "Drill"}`,
    title: drillTitle(drill.slug),
    description:
      "A branching decision drill from a real startup moment. Make the calls, see the consequences, get scored.",
  });
}
