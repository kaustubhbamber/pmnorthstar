"use client";

import Link from "next/link";
import {
  Home,
  FlameIcon,
  GraduationCap,
  MapPin,
  Layers,
  Sparkles,
  Gauge,
  Brain,
} from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { playlists } from "@/data/learn";
import { topics } from "@/data/topics";
import { comparisons } from "@/data/comparisons";

interface MobileNavProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  // Kept on the props for compatibility with existing callers — these
  // counts are now surfaced in the desktop Sidebar Library section,
  // not the mobile chip strip (which prioritizes content sections).
  savedCount?: number;
  favouriteCount?: number;
}

export function MobileNav({ activeNav, onNavChange }: MobileNavProps) {
  // Content-section chips only. Saved + Favourites moved out — they
  // belong with the Library section in the sidebar hamburger menu,
  // and demoting them here frees space for AI Decoded + India.
  const items = [
    { id: "home", label: "Home", icon: Home, count: null as number | null },
    {
      id: "casestudies",
      label: "Case Studies",
      icon: FlameIcon,
      count: caseStudies.length,
    },
    {
      id: "learn",
      label: "Learn",
      icon: GraduationCap,
      count: playlists.length,
    },
    {
      id: "explore",
      label: "Explore",
      icon: Layers,
      count: topics.length + comparisons.length,
    },
  ];

  return (
    <div
      className="lg:hidden flex items-center gap-1.5 px-3 sm:px-6 py-2 overflow-x-auto scroll-container flex-shrink-0"
      style={{
        background: "var(--nav-bg)",
        borderBottom: "1.5px solid var(--card-border)",
      }}
    >
      {items.slice(0, 2).map(({ id, label, icon: Icon, count }) => {
        const isActive = activeNav === id;
        return (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className={`chip flex-shrink-0 inline-flex items-center gap-1.5 ${
              isActive ? "active" : ""
            }`}
          >
            <Icon size={11} strokeWidth={1.6} />
            {label}
            {count !== null && <span className="chip-count">{count}</span>}
          </button>
        );
      })}

      {/* SimulateIt — newest tool, pinned at chip position 3 with the
          NEW badge so it gets the discovery moment. Pink #DB2777
          matches the home banner card + sidebar treatment. */}
      <Link
        href="/simulate"
        className="chip flex-shrink-0 inline-flex items-center gap-1.5"
        style={{
          borderColor: "rgba(219, 39, 119, 0.4)",
          background: "rgba(219, 39, 119, 0.08)",
        }}
      >
        <Brain size={11} strokeWidth={1.6} style={{ color: "#DB2777" }} />
        <span style={{ color: "var(--text-primary)" }}>SimulateIt</span>
        <span
          className="text-[9px] font-semibold px-1 rounded"
          style={{
            background: "#DB2777",
            color: "#fff",
            letterSpacing: "0.04em",
          }}
        >
          NEW
        </span>
      </Link>

      {/* CheckIt — site readiness scorecard. */}
      <Link
        href="/checkit"
        className="chip flex-shrink-0 inline-flex items-center gap-1.5"
        style={{
          borderColor: "rgba(243, 18, 60, 0.4)",
          background: "rgba(243, 18, 60, 0.08)",
        }}
      >
        <Gauge size={11} strokeWidth={1.6} style={{ color: "var(--brand-primary)" }} />
        <span style={{ color: "var(--text-primary)" }}>CheckIt</span>
      </Link>

      {/* AI Decoded — editorial AI section, sits next to the tools. */}
      <Link
        href="/ai-decoded"
        className="chip flex-shrink-0 inline-flex items-center gap-1.5"
      >
        <Sparkles size={11} strokeWidth={1.6} />
        AI Decoded
      </Link>

      {items.slice(2).map(({ id, label, icon: Icon, count }) => {
        const isActive = activeNav === id;
        return (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className={`chip flex-shrink-0 inline-flex items-center gap-1.5 ${
              isActive ? "active" : ""
            }`}
          >
            <Icon size={11} strokeWidth={1.6} />
            {label}
            {count !== null && <span className="chip-count">{count}</span>}
          </button>
        );
      })}

      {/* India — separate Link, navigates to /india */}
      <Link
        href="/india"
        className={`chip flex-shrink-0 inline-flex items-center gap-1.5 ${
          activeNav === "india" ? "active" : ""
        }`}
        style={{ borderColor: activeNav === "india" ? "#FF6B35" : undefined }}
      >
        <MapPin size={11} strokeWidth={1.6} />
        India
      </Link>
    </div>
  );
}
