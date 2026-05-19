import Link from "next/link";
import { SITE_INFO } from "@/lib/site";

interface BylineProps {
  // ISO date string (YYYY-MM-DD).
  date?: string;
  // "Reviewed" suits book pages; "Written" suits case studies;
  // "Selected" is a generic curatorial label.
  label?: "Reviewed" | "Written" | "Selected" | "Curated";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Editorial byline. Credits the site, not a person — keeps the
// editorial accountability visible without claiming a personal author.
export function Byline({ date, label = "Reviewed" }: BylineProps) {
  return (
    <div
      className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs"
      style={{ color: "var(--text-muted)" }}
    >
      <span>
        {label} by{" "}
        <Link
          href="/about"
          className="font-semibold transition-opacity hover:opacity-80"
          style={{ color: "var(--brand-primary)" }}
        >
          {SITE_INFO.byline}
        </Link>
      </span>
      {date && (
        <>
          <span style={{ color: "var(--text-faint)" }}>·</span>
          <span>Updated {formatDate(date)}</span>
        </>
      )}
    </div>
  );
}
