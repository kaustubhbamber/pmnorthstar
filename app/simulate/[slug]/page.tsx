// Server component for a single drill. Loads the drill from
// data/drills.ts, refuses to render anything if publishedAt is in
// the future (404), and hands the data off to the client-side
// SimulatePlayer for the interactive flow.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDrillBySlug, publishedDrills } from "@/data/drills";
import { SidebarShell } from "@/components/SidebarShell";
import { SimulatePlayer } from "./SimulatePlayer";

// ISR: pre-render published drills as static HTML and revalidate hourly.
// Future-dated drills aren't pre-built — they render on-demand, hit the
// publishedAt gate below (404), and go live within ~1h of their date once
// the revalidation window turns over. Matches the case-study/topic/compare
// scheduled-publishing path; replaces the old force-dynamic render.
export const revalidate = 3600;

export function generateStaticParams() {
  return publishedDrills().map((drill) => ({ slug: drill.slug }));
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const drill = getDrillBySlug(params.slug);
  if (!drill) return {};
  const published = new Date(drill.publishedAt) <= new Date();
  if (!published) return {};

  return {
    title: `${drillTitle(drill)} — SimulateIt`,
    description: drill.intro.split("\n\n")[0].slice(0, 180),
  };
}

export default function DrillPage({ params }: PageProps) {
  const drill = getDrillBySlug(params.slug);
  if (!drill) notFound();
  // In production, future-dated drills 404. In dev, every drill is
  // reachable so we can author and test before publish.
  const isDev = process.env.NODE_ENV !== "production";
  if (!isDev && new Date(drill.publishedAt) > new Date()) notFound();

  return (
    <SidebarShell>
      <SimulatePlayer drill={drill} />
    </SidebarShell>
  );
}

function drillTitle(drill: { slug: string }): string {
  return drill.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
