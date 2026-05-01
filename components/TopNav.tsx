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
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
  onAuthRequired?: () => void;
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
  isLoggedIn = false,
  userName,
  onLogout,
  onAuthRequired,
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
      className="flex-shrink-0 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      style={{
        background: "var(--nav-bg)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--card-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 flex-1 sm:max-w-sm px-3 py-2 rounded-lg transition-colors"
        style={{
          background: "transparent",
          border: `1px solid ${focused ? "var(--text-muted)" : "var(--card-border)"}`,
        }}
      >
        <Search size={14} strokeWidth={1.6} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search books, authors, topics"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
        />
        {searchQuery && (
          <button onClick={() => onSearchChange("")}>
            <X size={13} style={{ color: "var(--text-muted)" }} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-container pb-0.5 flex-1 min-w-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`chip flex-shrink-0 ${activeFilter === filter ? "active" : ""}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="hidden lg:inline-flex">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
          </span>

          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs"
                style={{
                  background: "transparent",
                  border: "1px solid var(--card-border)",
                  color: "var(--text-primary)",
                  letterSpacing: "0.04em",
                }}
                onClick={() => setShowMenu((p) => !p)}
              >
                {userName ? userName.charAt(0).toUpperCase() : "PM"}
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg overflow-hidden"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--card-border)",
                    zIndex: 200,
                  }}
                >
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid var(--card-border)" }}
                  >
                    <p className="eyebrow mb-1">// account</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      {userName || "Member"}
                    </p>
                  </div>
                  <button
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--brand-primary)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}
                    onClick={() => {
                      setShowMenu(false);
                      onLogout?.();
                    }}
                  >
                    <LogOut size={14} strokeWidth={1.6} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => onAuthRequired?.()} className="btn-accent" style={{ padding: "8px 14px", fontSize: 12 }}>
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
