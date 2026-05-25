"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShareButton } from "@/components/ShareButton";

interface SidebarShellProps {
  children: React.ReactNode;
  // Active nav highlight. Pass "" if this route isn't a main nav target.
  activeNav?: string;
  // Back link in header (e.g. {"href": "/ai-decoded", "label": "All AI Decoded"})
  backHref?: string;
  backLabelDesktop?: string;
  backLabelMobile?: string;
  // ShareButton inputs — if provided, surfaces a Share control in header.
  shareTitle?: string;
  shareText?: string;
}

// Shared chrome for content pages — sidebar + top header (with theme +
// share + back nav) + mobile nav strip + scrollable main area.
// Lets server-rendered pages (like /ai-decoded which reads markdown
// from disk) opt into the same layout as case studies / books / topics
// without converting the whole route to a client component.
export function SidebarShell({
  children,
  activeNav = "",
  backHref = "/",
  backLabelDesktop = "Back to the library",
  backLabelMobile = "Back",
  shareTitle,
  shareText,
}: SidebarShellProps) {
  const router = useRouter();
  // Lazy init from localStorage to avoid a paint flash when navigating
  // here from a dark page. The inline script in app/layout.tsx already
  // sets data-theme on <html> pre-paint; this keeps React state in sync.
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    }
  }, [isDark]);

  const handleNavChange = (next: string) => {
    if (next === "india") {
      router.push("/india");
    } else if (next === "ai-decoded") {
      router.push("/ai-decoded");
    } else {
      router.push(`/#${next}`);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--page-bg)" }}
    >
      <Sidebar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="flex-shrink-0 px-4 sm:px-6 py-3 flex items-center justify-between gap-3"
          style={{
            background: "var(--nav-bg)",
            borderBottom: "1.5px solid var(--card-border)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg lg:hidden flex-shrink-0"
              style={{ color: "var(--text-primary)" }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-medium flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={14} strokeWidth={1.6} />
              <span className="hidden sm:inline">{backLabelDesktop}</span>
              <span className="sm:hidden">{backLabelMobile}</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {shareTitle && (
              <ShareButton
                title={shareTitle}
                text={shareText ?? shareTitle}
                compact
              />
            )}
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </header>

        <MobileNav activeNav={activeNav} onNavChange={handleNavChange} />

        <main className="flex-1 overflow-y-auto scroll-container">
          {children}
        </main>
      </div>
    </div>
  );
}
