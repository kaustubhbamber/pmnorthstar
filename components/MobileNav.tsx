"use client";

import Link from "next/link";
import {
  Home,
  FlameIcon,
  GraduationCap,
  MapPin,
  Layers,
  Sparkles,
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
        borderBottom: "1px solid var(--card-border)",
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

      {/* AI Decoded — pinned high in the order with NEW badge so users
          notice the section. It's the freshest content on the site. */}
      <Link
        href="/ai-decoded"
        className="chip flex-shrink-0 inline-flex items-center gap-1.5"
        style={{
          borderColor: "rgba(243, 18, 60, 0.4)",
          background: "rgba(243, 18, 60, 0.08)",
        }}
      >
        <Sparkles size={11} strokeWidth={1.6} style={{ color: "var(--brand-primary)" }} />
        <span style={{ color: "var(--text-primary)" }}>AI Decoded</span>
        <span
          className="text-[9px] font-semibold px-1 rounded"
          style={{
            background: "var(--brand-primary)",
            color: "#fff",
            letterSpacing: "0.04em",
          }}
        >
          NEW
        </span>
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
