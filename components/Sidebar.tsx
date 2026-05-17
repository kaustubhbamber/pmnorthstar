"use client";

import Link from "next/link";
import { Home, BookMarked, Star, FlameIcon, GraduationCap, MapPin, Layers, X } from "lucide-react";
import { caseStudies } from "@/data/caseStudies";
import { playlists } from "@/data/learn";
import { topics } from "@/data/topics";
import { comparisons } from "@/data/comparisons";

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  savedCount?: number;
  favouriteCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const primaryNav = [
  { id: "home",         label: "Home",         icon: Home,           count: null as number | null },
  { id: "casestudies",  label: "Case Studies", icon: FlameIcon,      count: caseStudies.length },
  { id: "learn",        label: "Learn",        icon: GraduationCap,  count: playlists.length },
  { id: "explore",      label: "Explore",      icon: Layers,         count: topics.length + comparisons.length },
];

export function Sidebar({
  activeNav,
  onNavChange,
  savedCount = 0,
  favouriteCount = 0,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const handleNavClick = (nav: string) => {
    onNavChange(nav);
    onClose?.();
  };

  const NavButton = ({
    id,
    label,
    icon: Icon,
    count,
  }: {
    id: string;
    label: string;
    icon: any;
    count: number | null;
  }) => {
    const active = activeNav === id;
    return (
      <button
        onClick={() => handleNavClick(id)}
        className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${active ? "active" : ""}`}
        style={{ color: active ? "var(--text-primary)" : "var(--text-muted)" }}
      >
        <Icon size={15} strokeWidth={1.6} />
        <span style={{ letterSpacing: "-0.005em" }}>{label}</span>
        {count !== null && count > 0 && (
          <span
            className="ml-auto font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "0.06em",
              color: active ? "var(--text-muted)" : "var(--text-faint)",
            }}
          >
            {String(count).padStart(2, "0")}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[150] bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`flex flex-col h-full w-56 flex-shrink-0 py-6 px-3 fixed top-0 left-0 lg:static z-[200] transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-3 p-1.5 rounded-lg lg:hidden"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="px-3 mb-8">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--brand-primary)" }}
            >
              <Star size={13} className="text-white fill-white" strokeWidth={1.5} />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="font-display text-[16px] font-bold tracking-tight" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>north</span>
              <span className="font-display text-[16px] font-bold tracking-tight" style={{ color: "var(--brand-primary)", letterSpacing: "-0.02em" }}>star</span>
            </div>
          </div>
          <p className="text-[11px] mt-2 ml-0.5" style={{ color: "var(--text-faint)" }}>PM resources, curated</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto scroll-container">
          <p className="text-[11px] font-medium px-3 mb-2 uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>Navigate</p>

          {primaryNav.map((item) => (
            <NavButton key={item.id} {...item} />
          ))}

          {/* India — separate Link because it's a different route (not a tab) */}
          <Link
            href="/india"
            onClick={onClose}
            className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${activeNav === "india" ? "active" : ""}`}
            style={{ color: activeNav === "india" ? "var(--text-primary)" : "var(--text-muted)" }}
          >
            <MapPin size={15} strokeWidth={1.6} />
            <span style={{ letterSpacing: "-0.005em" }}>India</span>
          </Link>

          <div className="pt-5">
            <p className="text-[11px] font-medium px-3 mb-2 uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>Library</p>

            <NavButton
              id="saved"
              label="Saved"
              icon={BookMarked}
              count={savedCount > 0 ? savedCount : null}
            />
            <NavButton
              id="favourites"
              label="Favourites"
              icon={Star}
              count={favouriteCount > 0 ? favouriteCount : null}
            />
          </div>
        </nav>

        {/* Footer mark */}
        <div className="px-3 pt-4" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
          <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>v0.2 — public beta</p>
        </div>
      </aside>
    </>
  );
}
