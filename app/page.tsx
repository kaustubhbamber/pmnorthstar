"use client";

import { useState, useMemo, useEffect } from "react";
import {
  books,
  categories,
  getFeaturedBooks,
} from "@/data/books";
import {
  caseStudies,
  getCaseStudiesByCategory,
  CaseStudyCategory,
} from "@/data/caseStudies";
import {
  playlists,
  interleavedPlaylists,
  learnCategories,
  getPlaylistsByCategory,
  learnCategoryColors,
  LearnFilter,
} from "@/data/learn";
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { ResourceCard } from "@/components/ResourceCard";
import { SectionRow } from "@/components/SectionRow";
import { HeroBanner } from "@/components/HeroBanner";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { SubscribeForm } from "@/components/SubscribeForm";
import { AuthModal } from "@/components/AuthModal";
import { Footer } from "@/components/Footer";
import { topics } from "@/data/topics";
import { comparisons } from "@/data/comparisons";
import { getCaseStudyFaqs } from "@/data/caseStudyFaqs";
import { aiDecodedManifest } from "@/data/aiDecodedManifest";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  LogOut,
  Bookmark,
  Heart,
  Menu,
  Star,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const categoryAccents: Record<string, string> = {
  "Product Management": "#9B8FFF", // purple
  Startups: "#FF6B35",              // orange
  Management: "#4FC3F7",            // blue
};

const caseStudyCategoryColors: Record<string, string> = {
  Product: "#9B8FFF",
  Growth: "#FF6B35",
  Strategy: "#F5C842",
  Design: "#50C878",
  Failure: "#FF4B4B",
};

export default function HomePage() {
  // Lazy-init from localStorage so the home page doesn't flash light
  // when a user navigates here from a dark-mode page. SSR-safe: the
  // typeof check returns false on the server (initial HTML is light),
  // and the inline script in app/layout.tsx already sets data-theme on
  // the <html> tag before React hydrates, so there's no visible flash.
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Local dev bypass: Supabase is restoring, skip auth check on localhost.
    // Production is unaffected (NODE_ENV === "production" there).
    if (process.env.NODE_ENV === "development") {
      setUser({ id: "local-dev", name: "Local Dev", email: "dev@localhost" });
      setAuthLoading(false);
      return;
    }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    if (process.env.NODE_ENV === "development") return;
    fetch("/api/saved")
      .then((r) => r.json())
      .then((data) => {
        if (data.saved) setSavedIds(new Set(data.saved.map((s: any) => s.resourceId)));
      });
    fetch("/api/liked")
      .then((r) => r.json())
      .then((data) => {
        if (data.liked) setLikedIds(new Set(data.liked.map((l: any) => l.resourceId)));
      });
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setSavedIds(new Set());
    setLikedIds(new Set());
  };

  const handleSavedChange = (id: string, saved: boolean) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (saved) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleLikedChange = (id: string, liked: boolean) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (liked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCsFilter, setActiveCsFilter] = useState<CaseStudyCategory>("All");
  const [activeLearnFilter, setActiveLearnFilter] = useState<LearnFilter>("All");

  // When navigated in from another route (e.g. /india) with a hash like
  // #casestudies, set the active tab on mount so the right view loads.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const valid = ["home", "casestudies", "learn", "explore", "saved", "favourites"];
    const hash = window.location.hash.replace("#", "");
    if (hash && valid.includes(hash)) setActiveNav(hash);
  }, []);

  // Featured list, reordered so no two adjacent cards share an author.
  // Greedy: at each step, pick the first remaining item whose author
  // differs from the previously placed one.
  const featured = (() => {
    const items = getFeaturedBooks();
    const result: typeof items = [];
    const remaining = [...items];
    while (remaining.length > 0) {
      const lastAuthor = result[result.length - 1]?.author;
      const idx = remaining.findIndex((b) => b.author !== lastAuthor);
      result.push(remaining.splice(idx >= 0 ? idx : 0, 1)[0]);
    }
    return result;
  })();

  const filteredBooks = useMemo(() => {
    let result = books;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => {
        // Search the obvious fields first
        if (
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          b.description.toLowerCase().includes(q)
        )
          return true;
        // Then the editorial review body — analysis paragraphs,
        // key concept names + explanations, who-should-read.
        const s = b.summary;
        if (!s) return false;
        if (s.whoShouldRead.toLowerCase().includes(q)) return true;
        if (s.analysis.some((p) => p.toLowerCase().includes(q))) return true;
        if (
          s.keyConcepts.some(
            (kc) =>
              kc.name.toLowerCase().includes(q) ||
              kc.explanation.toLowerCase().includes(q)
          )
        )
          return true;
        return false;
      });
    }
    return result;
  }, [searchQuery]);

  const filteredCaseStudies = useMemo(
    () => getCaseStudiesByCategory(activeCsFilter),
    [activeCsFilter]
  );

  const filteredPlaylists = useMemo(
    () => getPlaylistsByCategory(activeLearnFilter),
    [activeLearnFilter]
  );

  // ── Cross-section search ──────────────────────────────────────────────
  const searchedCaseStudies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as typeof caseStudies;
    return caseStudies.filter((c) => {
      if (
        c.title.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.outcome.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.region && c.region.toLowerCase().includes(q)) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.content.toLowerCase().includes(q)
      )
        return true;
      // FAQ Q&A matching — surfaces case studies whose FAQs cover
      // the query even if the body doesn't.
      const faqs = getCaseStudyFaqs(c.id);
      return faqs.some(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const searchedPlaylists = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as typeof playlists;
    return playlists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.channel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.level && p.level.toLowerCase().includes(q)) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const searchedTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as typeof topics;
    return topics.filter((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        t.eyebrow.toLowerCase().includes(q) ||
        t.intro.toLowerCase().includes(q) ||
        t.metaTitle.toLowerCase().includes(q) ||
        t.metaDescription.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      )
        return true;
      if (
        t.faqs &&
        t.faqs.some(
          (f) =>
            f.question.toLowerCase().includes(q) ||
            f.answer.toLowerCase().includes(q)
        )
      )
        return true;
      return false;
    });
  }, [searchQuery]);

  const searchedAIDecoded = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as typeof aiDecodedManifest;
    return aiDecodedManifest.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.primaryKeyword.toLowerCase().includes(q) ||
        a.longTailKeywords.some((k) => k.toLowerCase().includes(q)) ||
        a.searchableContent.includes(q) // already lowercased at build time
    );
  }, [searchQuery]);

  const searchedComparisons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as typeof comparisons;
    return comparisons.filter((c) => {
      if (
        c.title.toLowerCase().includes(q) ||
        c.eyebrow.toLowerCase().includes(q) ||
        c.intro.toLowerCase().includes(q) ||
        c.verdict.toLowerCase().includes(q) ||
        c.metaTitle.toLowerCase().includes(q) ||
        c.metaDescription.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q)) ||
        c.rows.some(
          (r) =>
            r.label.toLowerCase().includes(q) ||
            r.a.toLowerCase().includes(q) ||
            r.b.toLowerCase().includes(q)
        )
      )
        return true;
      if (
        c.faqs &&
        c.faqs.some(
          (f) =>
            f.question.toLowerCase().includes(q) ||
            f.answer.toLowerCase().includes(q)
        )
      )
        return true;
      return false;
    });
  }, [searchQuery]);

  const learnStats = useMemo(() => {
    const counts: Record<string, number> = {};
    playlists.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, []);

  const heroBook = featured[0];
  const isFiltered = searchQuery.trim() !== "";

  const csStats = useMemo(() => {
    const counts: Record<string, number> = {};
    caseStudies.forEach((c) => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return counts;
  }, []);

  // ── Derived lists (used across views + sidebar counts) ─────────────────
  const savedBooks = books.filter((b) => savedIds.has(b.id) && !likedIds.has(b.id));
  const savedStudies = caseStudies.filter((s) => savedIds.has(s.id) && !likedIds.has(s.id));
  const savedPlaylists = playlists.filter((p) => savedIds.has(p.id) && !likedIds.has(p.id));
  const favouriteBooks = books.filter((b) => likedIds.has(b.id));
  const favouriteStudies = caseStudies.filter((s) => likedIds.has(s.id));
  const favouritePlaylists = playlists.filter((p) => likedIds.has(p.id));

  const savedCount = savedBooks.length + savedStudies.length + savedPlaylists.length;
  const favouriteCount = favouriteBooks.length + favouriteStudies.length + favouritePlaylists.length;

  // ── Saved for Later View ───────────────────────────────────────────────
  if (activeNav === "saved") {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header
            className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3"
            style={{ background: "var(--nav-bg)", borderBottom: "1.5px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg lg:hidden"
                style={{ color: "var(--text-primary)" }}
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="eyebrow hidden sm:block">Library</p>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Saved</h1>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </header>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

          <main className="flex-1 overflow-y-auto scroll-container p-4 sm:p-6 pb-12">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="eyebrow mb-3">Sign in required</p>
                <p className="text-base font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Sign in to see your saved items</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-accent mt-5"
                >
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-4">
                    <p className="eyebrow">Books</p>
                    <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{String(savedBooks.length)}</span>
                  </div>
                  {savedBooks.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No saved books yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {savedBooks.map((book, idx) => (
                        <ResourceCard
                          key={book.id}
                          book={book}
                          index={idx}
                          variant="list"
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(book.id)}
                          initialLiked={likedIds.has(book.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-4">
                    <p className="eyebrow">Case Studies</p>
                    <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{String(savedStudies.length)}</span>
                  </div>
                  {savedStudies.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No saved case studies yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedStudies.map((study, idx) => (
                        <CaseStudyCard
                          key={study.id}
                          study={study}
                          index={idx}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(study.id)}
                          initialLiked={likedIds.has(study.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    <p className="eyebrow">Playlists</p>
                    <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{String(savedPlaylists.length)}</span>
                  </div>
                  {savedPlaylists.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No saved playlists yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {savedPlaylists.map((playlist, idx) => (
                        <PlaylistCard
                          key={playlist.id}
                          playlist={playlist}
                          index={idx}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(playlist.id)}
                          initialLiked={likedIds.has(playlist.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />}
      </div>
    );
  }

  // ── Favourites View ────────────────────────────────────────────────────
  if (activeNav === "favourites") {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header
            className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3"
            style={{ background: "var(--nav-bg)", borderBottom: "1.5px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg lg:hidden"
                style={{ color: "var(--text-primary)" }}
              >
                <Menu size={20} />
              </button>
              <div>
                <p className="eyebrow hidden sm:block">Library</p>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Favourites</h1>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </header>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

          <main className="flex-1 overflow-y-auto scroll-container p-4 sm:p-6 pb-12">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="eyebrow mb-3">Sign in required</p>
                <p className="text-base font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Sign in to see your favourites</p>
                <button onClick={() => setShowAuthModal(true)} className="btn-accent mt-5">
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-4">
                    <p className="eyebrow">Books</p>
                    <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{String(favouriteBooks.length)}</span>
                  </div>
                  {favouriteBooks.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No favourite books yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {favouriteBooks.map((book, idx) => (
                        <ResourceCard
                          key={book.id}
                          book={book}
                          index={idx}
                          variant="list"
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(book.id)}
                          initialLiked={likedIds.has(book.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-4">
                    <p className="eyebrow">Case Studies</p>
                    <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{String(favouriteStudies.length)}</span>
                  </div>
                  {favouriteStudies.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No favourite case studies yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favouriteStudies.map((study, idx) => (
                        <CaseStudyCard
                          key={study.id}
                          study={study}
                          index={idx}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(study.id)}
                          initialLiked={likedIds.has(study.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    <p className="eyebrow">Playlists</p>
                    <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{String(favouritePlaylists.length)}</span>
                  </div>
                  {favouritePlaylists.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No favourite playlists yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {favouritePlaylists.map((playlist, idx) => (
                        <PlaylistCard
                          key={playlist.id}
                          playlist={playlist}
                          index={idx}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(playlist.id)}
                          initialLiked={likedIds.has(playlist.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />}
      </div>
    );
  }

  // ── Case Studies View ──────────────────────────────────────────────────
  if (activeNav === "casestudies") {
    const wins = filteredCaseStudies.filter((c) => c.category !== "Failure").length;
    const fails = filteredCaseStudies.filter((c) => c.category === "Failure").length;
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header
            className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3"
            style={{ background: "var(--nav-bg)", borderBottom: "1.5px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg lg:hidden" style={{ color: "var(--text-primary)" }}>
                <Menu size={20} />
              </button>
              <div>
                <p className="eyebrow hidden sm:block">Case Studies</p>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Case Studies
                </h1>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </header>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

          <main className="flex-1 overflow-y-auto scroll-container">
              <>
                {/* Hero strip */}
                <div className="dot-grid px-4 sm:px-8 py-10 sm:py-14" style={{ borderBottom: "1.5px solid var(--card-border)" }}>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="eyebrow">{caseStudies.length} studies</span>
                    <span className="w-px h-3" style={{ background: "var(--card-border)" }} />
                    <span className="eyebrow">5 categories</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                    Real product wins,<br className="hidden sm:block" />
                    <span className="gradient-warm">and the failures behind them.</span>
                  </h2>
                  <p className="text-sm max-w-xl" style={{ color: "var(--text-muted)" }}>
                    {caseStudies.length} deep-dives — pivots, growth loops, design bets, hard lessons.
                  </p>
                </div>

                <div className="px-4 sm:px-6 py-6">
                  {/* Filter chips */}
                  <div className="flex items-center gap-2 mb-6 overflow-x-auto scroll-container -mx-4 sm:-mx-6 px-4 sm:px-6 pb-1">
                    <button onClick={() => setActiveCsFilter("All")} className={`chip ${activeCsFilter === "All" ? "active" : ""}`}>
                      All <span className="chip-count">{caseStudies.length}</span>
                    </button>
                    {Object.entries(csStats).map(([cat, count]) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCsFilter(cat as CaseStudyCategory)}
                        className={`chip ${activeCsFilter === cat ? "active" : ""}`}
                      >
                        {cat} <span className="chip-count">{count}</span>
                      </button>
                    ))}
                  </div>

                  {/* Section heading. Category becomes a solid colored chip
                      (same idiom as section row eyebrows), with the count
                      sitting next to it. */}
                  {(() => {
                    const csColor =
                      activeCsFilter === "All"
                        ? "var(--brand-primary)"
                        : caseStudyCategoryColors[activeCsFilter];
                    const csLabel =
                      activeCsFilter === "All" ? "All Categories" : activeCsFilter;
                    return (
                      <div className="flex items-center justify-between mb-5 gap-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className="inline-block text-[10px] sm:text-xs font-bold uppercase px-2.5 py-1 rounded-md"
                            style={{
                              background: csColor,
                              color: "#ffffff",
                              letterSpacing: "0.12em",
                            }}
                          >
                            {csLabel}
                          </span>
                          <span
                            className="font-mono text-[11px]"
                            style={{ color: "var(--text-faint)" }}
                          >
                            {filteredCaseStudies.length} {filteredCaseStudies.length === 1 ? "study" : "studies"}
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-[12px] flex-shrink-0">
                          <span className="inline-flex items-center gap-1.5" style={{ color: "#50C878" }}>
                            <TrendingUp size={11} strokeWidth={1.6} /> {wins} wins
                          </span>
                          <span className="inline-flex items-center gap-1.5" style={{ color: "#FF4B4B" }}>
                            <TrendingDown size={11} strokeWidth={1.6} /> {fails} fails
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCaseStudies.map((study, idx) => (
                      <CaseStudyCard
                        key={study.id}
                        study={study}
                        index={idx}
                        isLoggedIn={!!user}
                        initialSaved={savedIds.has(study.id)}
                        initialLiked={likedIds.has(study.id)}
                        onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                      />
                    ))}
                  </div>
                </div>
              </>
          </main>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />}
      </div>
    );
  }

  // ── Learn View ─────────────────────────────────────────────────────────
  if (activeNav === "learn") {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header
            className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3"
            style={{ background: "var(--nav-bg)", borderBottom: "1.5px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded-lg lg:hidden"
                style={{ color: "var(--text-primary)" }}
              >
                <Menu size={20} />
              </button>
              <div>
                <span className="eyebrow hidden sm:block">Learn</span>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Learn
                </h1>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </header>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

          <main className="flex-1 overflow-y-auto scroll-container">
              <>
                {/* Hero strip */}
                <div
                  className="dot-grid px-4 sm:px-8 py-10 sm:py-14"
                  style={{ borderBottom: "1.5px solid var(--card-border)" }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="eyebrow">{playlists.length} playlists</span>
                    <span className="w-px h-3" style={{ background: "var(--card-border)" }} />
                    <span className="eyebrow">{learnCategories.length} topics</span>
                  </div>
                  <h2
                    className="text-2xl sm:text-4xl font-bold mb-3"
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
                  >
                    Curated YouTube playlists,<br className="hidden sm:block" />
                    <span className="gradient-cool">for builders who learn out loud.</span>
                  </h2>
                  <p
                    className="text-sm max-w-xl"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Design, product, data, marketing, branding, startups, finance — one shelf, hand-picked.
                  </p>
                </div>

                <div className="px-4 sm:px-6 py-6">
                  {/* Filter chips */}
                  <div className="flex items-center gap-2 mb-6 overflow-x-auto scroll-container -mx-4 sm:-mx-6 px-4 sm:px-6 pb-1">
                    <button
                      onClick={() => setActiveLearnFilter("All")}
                      className={`chip ${activeLearnFilter === "All" ? "active" : ""}`}
                    >
                      All <span className="chip-count">{playlists.length}</span>
                    </button>
                    {learnCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveLearnFilter(cat)}
                        className={`chip ${activeLearnFilter === cat ? "active" : ""}`}
                      >
                        {cat} <span className="chip-count">{learnStats[cat] || 0}</span>
                      </button>
                    ))}
                  </div>

                  {/* Section heading */}
                  {(() => {
                    const lnColor =
                      activeLearnFilter === "All"
                        ? "var(--brand-primary)"
                        : learnCategoryColors[activeLearnFilter];
                    const lnLabel =
                      activeLearnFilter === "All" ? "All Topics" : activeLearnFilter;
                    return (
                      <div className="flex items-center mb-5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className="inline-block text-[10px] sm:text-xs font-bold uppercase px-2.5 py-1 rounded-md"
                            style={{
                              background: lnColor,
                              color: "#ffffff",
                              letterSpacing: "0.12em",
                            }}
                          >
                            {lnLabel}
                          </span>
                          <span
                            className="font-mono text-[11px]"
                            style={{ color: "var(--text-faint)" }}
                          >
                            {filteredPlaylists.length} {filteredPlaylists.length === 1 ? "playlist" : "playlists"}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {filteredPlaylists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <GraduationCap size={40} style={{ color: "var(--text-faint)" }} />
                      <p className="text-base font-semibold mt-4" style={{ color: "var(--text-muted)" }}>No playlists yet in this topic</p>
                      <p className="text-sm mt-1" style={{ color: "var(--text-faint)" }}>Check back soon!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredPlaylists.map((playlist, idx) => (
                        <PlaylistCard
                          key={playlist.id}
                          playlist={playlist}
                          index={idx}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(playlist.id)}
                          initialLiked={likedIds.has(playlist.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
          </main>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />}
      </div>
    );
  }

  // ── Explore View — topics + comparisons aggregator ────────────────────
  if (activeNav === "explore") {
    return (
      <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header
            className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3"
            style={{ background: "var(--nav-bg)", borderBottom: "1.5px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg lg:hidden flex-shrink-0" style={{ color: "var(--text-primary)" }}>
                <Menu size={20} />
              </button>
              <div>
                <p className="eyebrow hidden sm:block">Explore</p>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Topics & Comparisons
                </h1>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </header>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

          <main className="flex-1 overflow-y-auto scroll-container">
            {/* Hero */}
            <section
              className="dot-grid px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
              style={{ borderBottom: "1.5px solid var(--card-border)" }}
            >
              <div className="max-w-3xl">
                <p className="eyebrow mb-3 sm:mb-4" style={{ color: "#26A69A" }}>
                  Curated paths through the library
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.1] mb-3 sm:mb-4" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                  <span className="gradient-warm">Different ways</span> to navigate the case studies.
                </h2>
                <p className="text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>Topics</strong> group case studies by theme (Indian fintech, super-app failures). <strong style={{ color: "var(--text-primary)" }}>Comparisons</strong> put two companies head-to-head when they share a market.
                </p>
              </div>
            </section>

            {/* Topics */}
            <section className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12" style={{ borderBottom: "1.5px solid var(--card-border)" }}>
              <div className="flex items-baseline gap-3 mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: "#26A69A", letterSpacing: "-0.02em" }}>
                  Topics
                </h2>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                  {topics.length} curated themes
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {topics.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/topics/${t.slug}`}
                    className="playlist-card surface p-4 sm:p-5 group"
                    style={{ ["--accent-color" as any]: t.accentColor } as React.CSSProperties}
                  >
                    <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: t.accentColor, opacity: 0.85 }}>
                      {t.eyebrow}
                    </p>
                    <p className="text-base sm:text-lg font-semibold leading-snug mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      {t.title}
                    </p>
                    <p className="text-xs sm:text-sm line-clamp-2 mb-3" style={{ color: "var(--text-muted)" }}>
                      {t.intro}
                    </p>
                    <p className="text-xs font-medium" style={{ color: t.accentColor }}>
                      {t.caseStudyIds.length} case studies →
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Comparisons */}
            <section className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
              <div className="flex items-baseline gap-3 mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: "#FF6B35", letterSpacing: "-0.02em" }}>
                  Comparisons
                </h2>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                  {comparisons.length} head-to-heads
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {comparisons.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/compare/${c.slug}`}
                    className="playlist-card surface p-4 sm:p-5 group"
                    style={{ ["--accent-color" as any]: c.accentColor } as React.CSSProperties}
                  >
                    <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: c.accentColor, opacity: 0.85 }}>
                      {c.eyebrow}
                    </p>
                    <p className="text-base sm:text-lg font-semibold leading-snug mb-2" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                      {c.title.split(" — ")[0]}
                    </p>
                    <p className="text-xs sm:text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
                      {c.intro.split(". ")[0]}.
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </main>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />}
      </div>
    );
  }

  // ── Main Home View ─────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--page-bg)" }}>
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header with hamburger */}
        <div
          className="flex items-center justify-between px-4 py-3 lg:hidden flex-shrink-0"
          style={{ background: "var(--nav-bg)", borderBottom: "1.5px solid var(--card-border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg"
              style={{ color: "var(--text-primary)" }}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "var(--brand-primary)" }}
              >
                <Star size={11} className="text-white fill-white" strokeWidth={1.5} />
              </div>
              <span className="font-display font-bold text-[15px]" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>north</span>
              <span className="font-display font-bold text-[15px]" style={{ color: "var(--brand-primary)", letterSpacing: "-0.02em" }}>star</span>
            </div>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
          isLoggedIn={!!user}
          userName={user?.name}
          onLogout={handleLogout}
          onAuthRequired={() => setShowAuthModal(true)}
        />

        {/* User bar — hidden on mobile when not logged in (microcopy
            adds a clutter row on small screens for no real value).
            Stays visible on mobile when logged in (saved/fav shortcuts
            are useful). */}
        <div
          className={`${user ? "flex" : "hidden sm:flex"} flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2`}
          style={{ borderBottom: "1.5px solid var(--card-border)", background: "var(--nav-bg)" }}
        >
          <p className="text-[11px] sm:text-xs truncate flex-shrink min-w-0" style={{ color: "var(--text-muted)" }}>
            {user ? `Welcome back, ${user.name}` : "Browse freely. Sign in only if you want to save."}
          </p>
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveNav("saved")}
                className="text-[11px] font-medium inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg"
                style={{ background: "transparent", border: "1.5px solid var(--card-border)", color: "var(--text-muted)" }}
              >
                <Bookmark size={10} strokeWidth={1.6} />
                <span className="hidden sm:inline">Saved </span><span style={{ color: "var(--text-faint)" }}>{savedCount}</span>
              </button>
              <button
                onClick={() => setActiveNav("favourites")}
                className="text-[11px] font-medium inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg"
                style={{ background: "transparent", border: "1.5px solid var(--card-border)", color: "var(--text-muted)" }}
              >
                <Heart size={10} strokeWidth={1.6} />
                <span className="hidden sm:inline">Fav </span><span style={{ color: "var(--text-faint)" }}>{favouriteCount}</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-[11px] font-medium inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg"
                style={{ background: "transparent", border: "1.5px solid var(--card-border)", color: "var(--text-muted)" }}
              >
                <LogOut size={10} strokeWidth={1.6} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          ) : null}
        </div>

        <main className="flex-1 overflow-y-auto scroll-container">
          {/* Render the library view immediately so the H1 + content reach
              SSR HTML (good for SEO crawlers and CheckIt) — auth state
              still resolves async but only changes save/like button
              interactivity, not page structure. */}
          {!isFiltered ? (
            <div className="pb-12">
              {heroBook && <HeroBanner onNavChange={setActiveNav} />}

              {/* Stats ticker. Solid-color magazine grid — each tile its
                  own bold color, white type. Different from the hero
                  blue/green (which signal Tool / Editorial) so the page
                  doesn't read as a single-system color block. */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mx-4 sm:mx-6 mt-6 mb-8">
                {[
                  { label: "books", value: String(books.length), color: "#EA580C", action: () => document.getElementById("books-section")?.scrollIntoView({ behavior: "smooth", block: "start" }) },
                  { label: "case studies", value: String(caseStudies.length), color: "#F3123C", action: () => setActiveNav("casestudies") },
                  { label: "playlists", value: String(playlists.length), color: "#7C3AED", action: () => setActiveNav("learn") },
                  { label: "categories", value: "3", color: "#0891B2", action: () => document.getElementById("books-section")?.scrollIntoView({ behavior: "smooth", block: "start" }) },
                ].map(({ label, value, color, action }) => (
                  <button
                    key={label}
                    type="button"
                    className="text-left p-4 rounded-2xl transition-all group hover:opacity-95 hover:-translate-y-0.5"
                    style={{ background: color, color: "#ffffff" }}
                    onClick={action}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[11px] font-semibold tracking-wider uppercase"
                        style={{ color: "rgba(255, 255, 255, 0.85)" }}
                      >
                        {label}
                      </span>
                      <ArrowUpRight
                        size={12}
                        strokeWidth={2}
                        style={{ color: "rgba(255, 255, 255, 0.85)" }}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                    <div
                      className="font-display text-2xl sm:text-3xl font-bold"
                      style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
                    >
                      {value}
                    </div>
                  </button>
                ))}
              </div>

              {/* Featured Row. Capped at 8 picks on the home view — the
                  full set lives on the per-category rows below. Keeps
                  the initial SSR payload lean (CheckIt was flagging
                  297KB) without hiding content from crawlers, since
                  every book gets its own page in the sitemap. */}
              <SectionRow title="Latest Picks" subtitle="Hand-curated for product learners" accentColor="#FF6B35">
                {featured.slice(0, 6).map((book, index) => (
                  <ResourceCard
                    key={book.id}
                    book={book}
                    index={index}
                    variant="featured"
                    isLoggedIn={!!user}
                    initialSaved={savedIds.has(book.id)}
                    initialLiked={likedIds.has(book.id)}
                    onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                  />
                ))}
              </SectionRow>

              <div className="section-divider my-8" id="books-section" />

              {/* Per-Category Rows. All books per category visible in
                  the horizontal-scroll SectionRow. The font preload
                  conversion (next/font) recovers far more perceived
                  perf than card trimming ever did, so payload isn't
                  the binding constraint here anymore. */}
              {categories.map((cat) => {
                const catBooks = books.filter((b) => b.category === cat);
                const shown = catBooks;
                const subtitle = `${catBooks.length} essential books`;
                return (
                  <div key={cat} className="mt-8">
                    <SectionRow title={cat} subtitle={subtitle} accentColor={categoryAccents[cat]}>
                      {shown.map((book, index) => (
                        <ResourceCard
                          key={book.id}
                          book={book}
                          index={index}
                          variant="default"
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(book.id)}
                          initialLiked={likedIds.has(book.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                        />
                      ))}
                    </SectionRow>
                    <div className="section-divider mt-8" />
                  </div>
                );
              })}

              {/* Case Studies Preview — horizontal carousel, 8 cards.
                  Wrapped in fixed-width containers so SectionRow's
                  horizontal-scroll can do its job. */}
              <SectionRow title="Case Studies" subtitle="Featured deep dives" accentColor="#F3123C">
                {caseStudies.slice(0, 8).map((study, idx) => (
                  <div
                    key={study.id}
                    className="flex-shrink-0 w-[280px] sm:w-[320px]"
                  >
                    <CaseStudyCard
                      study={study}
                      index={idx}
                      isLoggedIn={!!user}
                      initialSaved={savedIds.has(study.id)}
                      initialLiked={likedIds.has(study.id)}
                      onAuthRequired={() => setShowAuthModal(true)}
                      onSavedChange={handleSavedChange}
                      onLikedChange={handleLikedChange}
                    />
                  </div>
                ))}
              </SectionRow>

              {/* Explore preview — small teaser, full version on /explore tab */}
              <div className="px-4 sm:px-6 mt-10 mb-8">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="eyebrow mb-1.5" style={{ color: "#26A69A", opacity: 0.85 }}>Explore</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-base sm:text-lg font-semibold" style={{ color: "#26A69A", letterSpacing: "-0.02em" }}>
                        Topics & comparisons
                      </h2>
                      <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>
                        [{topics.length + comparisons.length}]
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      Curated themes & head-to-head comparisons
                    </p>
                  </div>
                  <button onClick={() => setActiveNav("explore")} className="btn-accent" style={{ padding: "8px 14px", fontSize: 12 }}>
                    View all
                    <ArrowUpRight size={12} strokeWidth={1.6} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {topics.slice(0, 4).map((t) => (
                    <Link
                      key={t.slug}
                      href={`/topics/${t.slug}`}
                      className="playlist-card surface p-4 sm:p-5 group"
                      style={{ ["--accent-color" as any]: t.accentColor } as React.CSSProperties}
                    >
                      <span
                        className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md mb-2"
                        style={{
                          background: t.accentColor,
                          color: "#ffffff",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {t.eyebrow}
                      </span>
                      <p
                        className="text-base sm:text-lg font-semibold leading-snug mb-2"
                        style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
                      >
                        {t.title}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {t.caseStudyIds.length} case studies
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Learn Preview — horizontal carousel, 8 cards */}
              <SectionRow
                title="Learn"
                subtitle={`Curated YouTube playlists across ${learnCategories.length} topics`}
                accentColor="#9B8FFF"
              >
                {interleavedPlaylists.slice(0, 8).map((playlist, idx) => (
                  <div
                    key={playlist.id}
                    className="flex-shrink-0 w-[280px] sm:w-[320px]"
                  >
                    <PlaylistCard
                      playlist={playlist}
                      index={idx}
                      isLoggedIn={!!user}
                      initialSaved={savedIds.has(playlist.id)}
                      initialLiked={likedIds.has(playlist.id)}
                      onAuthRequired={() => setShowAuthModal(true)}
                      onSavedChange={handleSavedChange}
                      onLikedChange={handleLikedChange}
                    />
                  </div>
                ))}
              </SectionRow>

              {/* Newsletter signup — bottom of home view */}
              <div className="px-4 sm:px-6 mt-10 mb-12">
                <div className="max-w-2xl mx-auto">
                  <SubscribeForm variant="card" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6 pb-12">
              {searchQuery.trim() ? (
                <>
                  {/* Search header */}
                  <div className="mb-6">
                    <p className="eyebrow mb-1.5">Search results</p>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        “{searchQuery}”
                      </h2>
                      <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                        {String(filteredBooks.length + searchedCaseStudies.length + searchedPlaylists.length + searchedAIDecoded.length + searchedTopics.length + searchedComparisons.length)}
                      </span>
                    </div>
                  </div>

                  {filteredBooks.length + searchedCaseStudies.length + searchedPlaylists.length + searchedAIDecoded.length + searchedTopics.length + searchedComparisons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <p className="eyebrow mb-3">No results</p>
                      <p className="text-base font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Nothing matched</p>
                      <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Try a different keyword</p>
                    </div>
                  ) : (
                    <>
                      {/* Books group */}
                      {filteredBooks.length > 0 && (
                        <div className="mb-10">
                          <div className="flex items-baseline gap-3 mb-4">
                            <p className="eyebrow">Books</p>
                            <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                              {String(filteredBooks.length)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredBooks.map((book, index) => (
                              <ResourceCard
                                key={book.id}
                                book={book}
                                index={index}
                                variant="list"
                                isLoggedIn={!!user}
                                initialSaved={savedIds.has(book.id)}
                                initialLiked={likedIds.has(book.id)}
                                onAuthRequired={() => setShowAuthModal(true)}
                                onSavedChange={handleSavedChange}
                                onLikedChange={handleLikedChange}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Case studies group */}
                      {searchedCaseStudies.length > 0 && (
                        <div className="mb-10">
                          <div className="flex items-baseline gap-3 mb-4">
                            <p className="eyebrow">Case Studies</p>
                            <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                              {String(searchedCaseStudies.length)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {searchedCaseStudies.map((study, idx) => (
                              <CaseStudyCard
                                key={study.id}
                                study={study}
                                index={idx}
                                isLoggedIn={!!user}
                                initialSaved={savedIds.has(study.id)}
                                initialLiked={likedIds.has(study.id)}
                                onAuthRequired={() => setShowAuthModal(true)}
                                onSavedChange={handleSavedChange}
                                onLikedChange={handleLikedChange}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Decoded group — brand-tinted to match the
                          section's prominent slot in nav */}
                      {searchedAIDecoded.length > 0 && (
                        <div className="mb-10">
                          <div className="flex items-baseline gap-3 mb-4">
                            <p className="eyebrow" style={{ color: "var(--brand-primary)" }}>
                              AI Decoded
                            </p>
                            <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                              {String(searchedAIDecoded.length)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {searchedAIDecoded.map((a) => (
                              <Link
                                key={a.slug}
                                href={`/ai-decoded/${a.slug}`}
                                className="surface p-4 group transition-colors"
                                style={{
                                  borderRadius: 12,
                                  borderColor: "rgba(243, 18, 60, 0.30)",
                                }}
                              >
                                <p
                                  className="text-[10px] font-medium uppercase tracking-wider mb-1.5 inline-flex items-center gap-1"
                                  style={{ color: "var(--brand-primary)" }}
                                >
                                  <Sparkles size={10} strokeWidth={1.8} />
                                  {a.category}
                                </p>
                                <p
                                  className="text-sm font-semibold leading-snug mb-1.5 line-clamp-2"
                                  style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
                                >
                                  {a.title}
                                </p>
                                <p
                                  className="text-xs leading-relaxed line-clamp-2"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  {a.excerpt}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Playlists group */}
                      {searchedPlaylists.length > 0 && (
                        <div className="mb-10">
                          <div className="flex items-baseline gap-3 mb-4">
                            <p className="eyebrow">Playlists</p>
                            <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                              {String(searchedPlaylists.length)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {searchedPlaylists.map((playlist, idx) => (
                              <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                index={idx}
                                isLoggedIn={!!user}
                                initialSaved={savedIds.has(playlist.id)}
                                initialLiked={likedIds.has(playlist.id)}
                                onAuthRequired={() => setShowAuthModal(true)}
                                onSavedChange={handleSavedChange}
                                onLikedChange={handleLikedChange}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Topics group — clickable cards link to /topics/[slug] */}
                      {searchedTopics.length > 0 && (
                        <div className="mb-10">
                          <div className="flex items-baseline gap-3 mb-4">
                            <p className="eyebrow">Topics</p>
                            <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                              {String(searchedTopics.length)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {searchedTopics.map((t) => (
                              <Link
                                key={t.slug}
                                href={`/topics/${t.slug}`}
                                className="surface p-4 group transition-colors"
                                style={{ borderRadius: 12 }}
                              >
                                <p
                                  className="text-[10px] font-medium uppercase tracking-wider mb-1.5"
                                  style={{ color: t.accentColor }}
                                >
                                  Topic
                                </p>
                                <p
                                  className="text-sm font-semibold leading-snug mb-1.5 line-clamp-2"
                                  style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
                                >
                                  {t.title}
                                </p>
                                <p
                                  className="text-xs leading-relaxed line-clamp-2"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  {t.eyebrow}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comparisons group — clickable cards link to /compare/[slug] */}
                      {searchedComparisons.length > 0 && (
                        <div>
                          <div className="flex items-baseline gap-3 mb-4">
                            <p className="eyebrow">Comparisons</p>
                            <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                              {String(searchedComparisons.length)}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {searchedComparisons.map((c) => (
                              <Link
                                key={c.slug}
                                href={`/compare/${c.slug}`}
                                className="surface p-4 group transition-colors"
                                style={{ borderRadius: 12 }}
                              >
                                <p
                                  className="text-[10px] font-medium uppercase tracking-wider mb-1.5"
                                  style={{ color: c.accentColor }}
                                >
                                  Comparison
                                </p>
                                <p
                                  className="text-sm font-semibold leading-snug mb-1.5 line-clamp-2"
                                  style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
                                >
                                  {c.title}
                                </p>
                                <p
                                  className="text-xs leading-relaxed line-clamp-2"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  {c.eyebrow}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="eyebrow mb-1.5">Search</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        Results for &ldquo;{searchQuery.trim()}&rdquo;
                      </h2>
                      <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                        {String(filteredBooks.length)}
                      </span>
                    </div>
                  </div>
                  {filteredBooks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <p className="eyebrow mb-3">No results</p>
                      <p className="text-base font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>No books found</p>
                      <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Try a different category</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredBooks.map((book, index) => (
                        <ResourceCard
                          key={book.id}
                          book={book}
                          index={index}
                          variant="list"
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(book.id)}
                          initialLiked={likedIds.has(book.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                          onSavedChange={handleSavedChange}
                          onLikedChange={handleLikedChange}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <Footer />
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />}
    </div>
  );
}
