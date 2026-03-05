"use client";

import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300"
      style={{
        background: isDark ? "rgba(180,30,30,0.15)" : "rgba(180,30,30,0.1)",
        border: "1px solid rgba(180,30,30,0.35)",
        color: isDark ? "#fff" : "#1A0000",
      }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div
        className="relative w-8 h-4 rounded-full transition-all duration-300"
        style={{ background: isDark ? "#B41E1E" : "#e5e5e5" }}
      >
        <div
          className="absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 shadow-sm"
          style={{
            left: isDark ? "18px" : "2px",
            background: isDark ? "#fff" : "#B41E1E",
          }}
        />
      </div>
      {isDark ? (
        <Moon size={14} style={{ color: "#B41E1E" }} />
      ) : (
        <Sun size={14} style={{ color: "#B41E1E" }} />
      )}
    </button>
  );
}