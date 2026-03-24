"use client";

import { Search, X, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Category } from "@/data/books";
import { ThemeToggle } from "@/components/ThemeToggle";

interface TopNavProps {
  activeFilter: "All" | Category;
  onFilterChange: (filter: "All" | Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

const filters: ("All" | Category)[] = [
  "All",
  "Product Management",
  "Startups",
  "Management",
];

export function TopNav({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  isDark,
  onThemeToggle,
}: TopNavProps) {
  const [focused, setFocused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      style={{
        background: "var(--nav-bg)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--card-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Search Bar */}
      <div
        className="flex items-center gap-2 flex-1 sm:max-w-sm px-3 py-2 rounded-xl transition-all duration-200"
        style={{
          background: "var(--card-bg)",
          border: `1px solid ${focused ? "var(--brand-primary)" : "var(--card-border)"}`,
          boxShadow: focused ? "0 0 0 3px rgba(180, 30, 30, 0.12)" : "none",
        }}
      >
        <Search size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search books, authors, topics..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-50"
          style={{ color: "var(--text-primary)" }}
        />
        {searchQuery && (
          <button onClick={() => onSearchChange("")}>
            <X size={13} style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      {/* Filter Chips + Right Actions row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scroll-container pb-0.5 flex-1 min-w-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`filter-chip flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium ${
                activeFilter === filter ? "active" : ""
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="hidden sm:inline-flex">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
          </span>

        {/* Avatar + Dropdown */}
        <div className="relative" ref={menuRef}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--brand-primary), #8B0000)",
            }}
            onClick={() => setShowMenu((p) => !p)}
          >
            <span className="text-white text-xs font-bold">PM</span>
          </div>

          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                zIndex: 200,
              }}
            >
              <div
                className="px-4 py-3"
                style={{ borderBottom: "1px solid var(--card-border)" }}
              >
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                  PM Team
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  NorthStar Hub
                </p>
              </div>
              <button
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors"
                style={{ color: "var(--danger, #e02020)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "var(--brand-soft)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
                }
                onClick={() => {
                  // wire to your auth logout here
                  setShowMenu(false);
                }}
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}