"use client";

import Link from "next/link";
import { Home, BookMarked, Star, FlameIcon, GraduationCap, MapPin, Layers, Sparkles } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { playlists } from "@/data/learn";
import { topics } from "@/data/topics";
import { comparisons } from "@/data/comparisons";

interface MobileNavProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  savedCount?: number;
  favouriteCount?: number;
}

export function MobileNav({
  activeNav,
  onNavChange,
  savedCount = 0,
  favouriteCount = 0,
}: MobileNavProps) {
  const items = [
    { id: "home",        label: "Home",        icon: Home,           count: null as number | null },
    { id: "casestudies", label: "Case Studies", icon: FlameIcon,     count: caseStudies.length },
    { id: "learn",       label: "Learn",       icon: GraduationCap,  count: playlists.length },
    { id: "explore",     label: "Explore",     icon: Layers,         count: topics.length + comparisons.length },
    { id: "saved",       label: "Saved",       icon: BookMarked,     count: savedCount > 0 ? savedCount : null },
    { id: "favourites",  label: "Favourites",  icon: Star,           count: favouriteCount > 0 ? favouriteCount : null },
  ];

  return (
    <div
      className="lg:hidden flex items-center gap-2 px-4 sm:px-6 py-2.5 overflow-x-auto scroll-container flex-shrink-0"
      style={{
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      {items.map(({ id, label, icon: Icon, count }) => {
        const isExactActive = activeNav === id;
        return (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className={`chip flex-shrink-0 inline-flex items-center gap-1.5 ${isExactActive ? "active" : ""}`}
          >
            <Icon size={11} strokeWidth={1.6} />
            {label}
            {count !== null && (
              <span className="chip-count">{count}</span>
            )}
          </button>
        );
      })}

      {/* AI Decoded — editorial section on AI launches + tools */}
      <Link
        href="/ai-decoded"
        className="chip flex-shrink-0 inline-flex items-center gap-1.5"
      >
        <Sparkles size={11} strokeWidth={1.6} />
        AI Decoded
      </Link>

      {/* India — separate Link, navigates to /india */}
      <Link
        href="/india"
        className={`chip flex-shrink-0 inline-flex items-center gap-1.5 ${activeNav === "india" ? "active" : ""}`}
        style={{ borderColor: activeNav === "india" ? "#FF6B35" : undefined }}
      >
        <MapPin size={11} strokeWidth={1.6} />
        India
      </Link>
    </div>
  );
}
