"use client";

import { useState, useMemo, useEffect } from "react";
import {
  books,
  categories,
  getFeaturedBooks,
  Category,
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
import { AuthModal } from "@/components/AuthModal";
import {
  TrendingUp,
  TrendingDown,
  LogOut,
  User,
  Bookmark,
  Heart,
  Menu,
  Star,
  GraduationCap,
  ArrowUpRight,
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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
    else setIsDark(false);
  }, []);

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
  const [activeFilter, setActiveFilter] = useState<"All" | Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCsFilter, setActiveCsFilter] = useState<CaseStudyCategory>("All");
  const [activeLearnFilter, setActiveLearnFilter] = useState<LearnFilter>("All");

  const featured = getFeaturedBooks();

  const filteredBooks = useMemo(() => {
    let result = books;
    if (activeFilter !== "All") result = result.filter((b) => b.category === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          b.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeFilter, searchQuery]);

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
    return caseStudies.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.outcome.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const searchedPlaylists = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as typeof playlists;
    return playlists.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.channel.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const learnStats = useMemo(() => {
    const counts: Record<string, number> = {};
    playlists.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, []);

  const heroBook = featured[0];
  const isFiltered = activeFilter !== "All" || searchQuery.trim() !== "";

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
            style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--card-border)" }}
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
                <p className="eyebrow hidden sm:block">// library.saved</p>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Saved</h1>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </header>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

          <main className="flex-1 overflow-y-auto scroll-container p-4 sm:p-6 pb-12">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="eyebrow mb-3">// auth.required</p>
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
                    <p className="eyebrow">// books</p>
                    <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>[{String(savedBooks.length).padStart(2, "0")}]</span>
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
                    <p className="eyebrow">// case_studies</p>
                    <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>[{String(savedStudies.length).padStart(2, "0")}]</span>
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
                    <p className="eyebrow">// playlists</p>
                    <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>[{String(savedPlaylists.length).padStart(2, "0")}]</span>
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
            style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--card-border)" }}
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
                <p className="eyebrow hidden sm:block">// library.favourites</p>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Favourites</h1>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </header>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

          <main className="flex-1 overflow-y-auto scroll-container p-4 sm:p-6 pb-12">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="eyebrow mb-3">// auth.required</p>
                <p className="text-base font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Sign in to see your favourites</p>
                <button onClick={() => setShowAuthModal(true)} className="btn-accent mt-5">
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-4">
                    <p className="eyebrow">// books</p>
                    <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>[{String(favouriteBooks.length).padStart(2, "0")}]</span>
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
                    <p className="eyebrow">// case_studies</p>
                    <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>[{String(favouriteStudies.length).padStart(2, "0")}]</span>
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
                    <p className="eyebrow">// playlists</p>
                    <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>[{String(favouritePlaylists.length).padStart(2, "0")}]</span>
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
            style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg lg:hidden" style={{ color: "var(--text-primary)" }}>
                <Menu size={20} />
              </button>
              <div>
                <p className="eyebrow hidden sm:block">// case_studies.index</p>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Case Studies
                </h1>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </header>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

          <main className="flex-1 overflow-y-auto scroll-container">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="eyebrow mb-3">// auth.required</p>
                <p className="text-base font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Sign in to view case studies</p>
                <button onClick={() => setShowAuthModal(true)} className="btn-accent mt-5">
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <>
                {/* Hero strip */}
                <div className="dot-grid px-4 sm:px-8 py-10 sm:py-14" style={{ borderBottom: "1px solid var(--card-border)" }}>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="eyebrow">{String(caseStudies.length).padStart(2, "0")} / studies</span>
                    <span className="w-px h-3" style={{ background: "var(--card-border)" }} />
                    <span className="eyebrow">5 categories</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                    Real product wins,<br className="hidden sm:block" />
                    <span style={{ color: "var(--text-muted)" }}>and the failures behind them.</span>
                  </h2>
                  <p className="text-sm max-w-xl" style={{ color: "var(--text-muted)" }}>
                    50 deep-dives — pivots, growth loops, design bets, hard lessons.
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

                  {/* Section heading */}
                  {(() => {
                    const csColor = activeCsFilter === "All" ? undefined : caseStudyCategoryColors[activeCsFilter];
                    return (
                      <div className="flex items-baseline justify-between mb-5">
                        <div className="flex items-baseline gap-3">
                          <span
                            className="eyebrow"
                            style={csColor ? { color: csColor, opacity: 0.85 } : undefined}
                          >
                            // {activeCsFilter === "All" ? "all" : activeCsFilter.toLowerCase()}
                          </span>
                          <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                            [{String(filteredCaseStudies.length).padStart(2, "0")}]
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 font-mono text-[11px]" style={{ letterSpacing: "0.04em" }}>
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
            )}
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
            style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--card-border)" }}
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
                <span className="eyebrow hidden sm:block">// learn.index</span>
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Learn
                </h1>
              </div>
            </div>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </header>

          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

          <main className="flex-1 overflow-y-auto scroll-container">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <GraduationCap size={40} style={{ color: "var(--text-faint)" }} />
                <p className="text-base font-semibold mt-4" style={{ color: "var(--text-muted)" }}>Sign in to access learning playlists</p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <>
                {/* Hero strip */}
                <div
                  className="dot-grid px-4 sm:px-8 py-10 sm:py-14"
                  style={{ borderBottom: "1px solid var(--card-border)" }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="eyebrow">{String(playlists.length).padStart(2, "0")} / playlists</span>
                    <span className="w-px h-3" style={{ background: "var(--card-border)" }} />
                    <span className="eyebrow">{learnCategories.length} topics</span>
                  </div>
                  <h2
                    className="text-2xl sm:text-4xl font-bold mb-3"
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
                  >
                    Curated YouTube playlists,<br className="hidden sm:block" />
                    <span style={{ color: "var(--text-muted)" }}>for builders who learn out loud.</span>
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
                    const lnColor = activeLearnFilter === "All" ? undefined : learnCategoryColors[activeLearnFilter];
                    return (
                      <div className="flex items-baseline justify-between mb-5">
                        <div className="flex items-baseline gap-3">
                          <span
                            className="eyebrow"
                            style={lnColor ? { color: lnColor, opacity: 0.85 } : undefined}
                          >
                            // {activeLearnFilter === "All" ? "all" : activeLearnFilter.toLowerCase()}
                          </span>
                          <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                            [{String(filteredPlaylists.length).padStart(2, "0")}]
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
            )}
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
          style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--card-border)" }}
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
              <span className="font-mono font-bold text-[13px]" style={{ color: "var(--text-primary)", letterSpacing: "-0.04em" }}>north</span>
              <span className="font-mono font-bold text-[13px]" style={{ color: "var(--brand-primary)", letterSpacing: "-0.04em" }}>_star</span>
            </div>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        <MobileNav activeNav={activeNav} onNavChange={setActiveNav} savedCount={savedCount} favouriteCount={favouriteCount} />

        <TopNav
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
          isLoggedIn={!!user}
          userName={user?.name}
          onLogout={handleLogout}
          onAuthRequired={() => setShowAuthModal(true)}
        />

        {/* User bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2"
          style={{ borderBottom: "1px solid var(--card-border)", background: "var(--nav-bg)" }}
        >
          <p className="font-mono text-[11px]" style={{ color: "var(--text-muted)", letterSpacing: "0.04em" }}>
            {user ? `// hello, ${user.name.toLowerCase()}` : "// sign in to save and like resources"}
          </p>
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveNav("saved")}
                className="font-mono text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-muted)" }}
              >
                <Bookmark size={10} strokeWidth={1.6} />
                Saved <span style={{ color: "var(--text-faint)" }}>{String(savedCount).padStart(2, "0")}</span>
              </button>
              <button
                onClick={() => setActiveNav("favourites")}
                className="font-mono text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-muted)" }}
              >
                <Heart size={10} strokeWidth={1.6} />
                Fav <span style={{ color: "var(--text-faint)" }}>{String(favouriteCount).padStart(2, "0")}</span>
              </button>
              <button
                onClick={handleLogout}
                className="font-mono text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{ background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-muted)" }}
              >
                <LogOut size={10} strokeWidth={1.6} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="btn-accent" style={{ padding: "6px 12px", fontSize: 12 }}>
              <User size={11} /> Log In
            </button>
          )}
        </div>

        <main className="flex-1 overflow-y-auto scroll-container">
          {authLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "var(--card-border)", borderTopColor: "var(--brand-primary)" }} />
            </div>
          ) : !user ? (
            <div className="pb-12 overflow-y-auto">
              {/* Hero */}
              <div className="dot-grid px-4 sm:px-8 py-16 sm:py-24 text-center" style={{ borderBottom: "1px solid var(--card-border)" }}>
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="eyebrow">// pm.library</span>
                    <span className="w-px h-3" style={{ background: "var(--card-border)" }} />
                    <span className="eyebrow">v0.1</span>
                  </div>
                  <h1
                    className="text-4xl sm:text-6xl font-bold mb-5"
                    style={{ color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
                  >
                    Product management,<br />
                    <span style={{ color: "var(--text-muted)" }}>distilled.</span>
                  </h1>
                  <p
                    className="text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    A curated shelf of books, case studies, and playlists — for builders learning out loud.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button onClick={() => setShowAuthModal(true)} className="btn-primary group">
                      Get started
                      <ArrowUpRight size={14} strokeWidth={1.8} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                    <button onClick={() => setShowAuthModal(true)} className="btn-ghost">
                      Free forever
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats ticker */}
              <div className="px-4 sm:px-8 py-8 sm:py-10 grid grid-cols-3 max-w-3xl mx-auto" style={{ borderBottom: "1px solid var(--card-border)" }}>
                {[
                  { value: "30", label: "books" },
                  { value: "50", label: "case studies" },
                  { value: String(playlists.length), label: "playlists" },
                ].map(({ value, label }, idx) => (
                  <div
                    key={label}
                    className={`text-left px-3 sm:px-6 ${idx > 0 ? "border-l" : ""}`}
                    style={{ borderColor: "var(--card-border)" }}
                  >
                    <div className="font-mono text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                      // {label}
                    </div>
                    <div className="text-3xl sm:text-5xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                      {String(value).padStart(2, "0")}
                    </div>
                  </div>
                ))}
              </div>

              {/* What's inside */}
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <p className="eyebrow mb-3">// what's inside</p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  Four shelves, one library.
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {[
                    { num: "01", title: "Book library", desc: "30 essential reads across Product, Startups, and Management — with summaries and direct links." },
                    { num: "02", title: "Case studies", desc: "Deep dives into Apple, Spotify, Airbnb, Slack, and 46 more — wins and failures." },
                    { num: "03", title: "Learn", desc: "Curated YouTube playlists across design, data, marketing, and more." },
                    { num: "04", title: "Save & organize", desc: "Bookmark resources, mark favourites, build your personal reading list." },
                  ].map(({ num, title, desc }, idx) => (
                    <div
                      key={title}
                      className={`p-5 sm:p-6 ${idx % 2 === 0 ? "sm:border-r" : ""} ${idx < 2 ? "border-b" : ""}`}
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="font-mono text-xs" style={{ color: "var(--text-faint)", letterSpacing: "0.08em" }}>
                          {num}
                        </span>
                        <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured strip */}
              <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
                <p className="eyebrow mb-4">// featured</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {caseStudies.slice(0, 8).map((cs, idx) => (
                    <div
                      key={cs.id}
                      className="surface p-4"
                      style={{ borderRadius: 10 }}
                    >
                      <p className="font-mono text-[10px] mb-2" style={{ color: "var(--text-faint)", letterSpacing: "0.08em" }}>
                        {String(idx + 1).padStart(2, "0")}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{cs.company}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{cs.category}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center px-4 pb-12">
                <p className="eyebrow mb-4">// no credit card required</p>
                <button onClick={() => setShowAuthModal(true)} className="btn-primary group">
                  Sign up for free
                  <ArrowUpRight size={14} strokeWidth={1.8} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          ) : !isFiltered ? (
            <div className="pb-12">
              {heroBook && <HeroBanner onNavChange={setActiveNav} />}

              {/* Stats ticker */}
              <div className="grid grid-cols-2 sm:grid-cols-4 mx-4 sm:mx-6 mt-6 mb-8 surface" style={{ borderRadius: 12 }}>
                {[
                  { label: "books", value: "30", nav: null as string | null },
                  { label: "case_studies", value: "50", nav: "casestudies" },
                  { label: "playlists", value: String(playlists.length), nav: "learn" },
                  { label: "categories", value: "3", nav: null as string | null },
                ].map(({ label, value, nav }, idx) => (
                  <button
                    key={label}
                    className={`text-left p-4 ${idx > 0 ? "border-l" : ""} ${idx === 1 || idx === 3 ? "" : ""} transition-colors group`}
                    style={{ borderColor: "var(--card-border)", cursor: nav ? "pointer" : "default" }}
                    onClick={() => nav && setActiveNav(nav)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-faint)" }}>
                        // {label}
                      </span>
                      {nav && (
                        <ArrowUpRight
                          size={12}
                          strokeWidth={1.6}
                          style={{ color: "var(--text-faint)" }}
                          className="transition-all group-hover:text-[color:var(--brand-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      )}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                      {String(value).padStart(2, "0")}
                    </div>
                  </button>
                ))}
              </div>

              {/* Featured Row */}
              <SectionRow title="Latest Picks" subtitle="Hand-curated for product learners" accentColor="var(--brand-primary)">
                {featured.map((book, index) => (
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

              <div className="section-divider my-8" />

              {/* Per-Category Rows */}
              {categories.map((cat) => {
                const catBooks = books.filter((b) => b.category === cat);
                return (
                  <div key={cat} className="mt-8">
                    <SectionRow title={cat} subtitle={`${catBooks.length} essential books`} accentColor={categoryAccents[cat]}>
                      {catBooks.map((book, index) => (
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

              {/* Case Studies Preview */}
              <div className="px-4 sm:px-6 mt-10 mb-8">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="eyebrow mb-1.5">// case_studies</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-base sm:text-lg font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        Case Studies
                      </h2>
                      <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>[50]</span>
                    </div>
                  </div>
                  <button onClick={() => setActiveNav("casestudies")} className="btn-ghost">
                    View all
                    <ArrowUpRight size={12} strokeWidth={1.6} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseStudies.slice(0, 6).map((study, idx) => (
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

              {/* Learn Preview */}
              <div className="px-4 sm:px-6 mt-10 mb-8">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="eyebrow mb-1.5">// learn</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-base sm:text-lg font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        Learn
                      </h2>
                      <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>[{String(playlists.length).padStart(2, "0")}]</span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      Curated YouTube playlists across {learnCategories.length} topics
                    </p>
                  </div>
                  <button onClick={() => setActiveNav("learn")} className="btn-ghost">
                    View all
                    <ArrowUpRight size={12} strokeWidth={1.6} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {interleavedPlaylists.slice(0, 6).map((playlist, idx) => (
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
            </div>
          ) : (
            <div className="p-4 sm:p-6 pb-12">
              {searchQuery.trim() ? (
                <>
                  {/* Search header */}
                  <div className="mb-6">
                    <p className="eyebrow mb-1.5">// search</p>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        “{searchQuery}”
                      </h2>
                      <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                        [{String(filteredBooks.length + searchedCaseStudies.length + searchedPlaylists.length).padStart(2, "0")}]
                      </span>
                    </div>
                  </div>

                  {filteredBooks.length + searchedCaseStudies.length + searchedPlaylists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <p className="eyebrow mb-3">// no results</p>
                      <p className="text-base font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Nothing matched</p>
                      <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Try a different keyword</p>
                    </div>
                  ) : (
                    <>
                      {/* Books group */}
                      {filteredBooks.length > 0 && (
                        <div className="mb-10">
                          <div className="flex items-baseline gap-3 mb-4">
                            <p className="eyebrow">// books</p>
                            <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>
                              [{String(filteredBooks.length).padStart(2, "0")}]
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
                            <p className="eyebrow">// case_studies</p>
                            <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>
                              [{String(searchedCaseStudies.length).padStart(2, "0")}]
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

                      {/* Playlists group */}
                      {searchedPlaylists.length > 0 && (
                        <div>
                          <div className="flex items-baseline gap-3 mb-4">
                            <p className="eyebrow">// playlists</p>
                            <span className="font-mono text-[11px]" style={{ color: "var(--text-faint)" }}>
                              [{String(searchedPlaylists.length).padStart(2, "0")}]
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
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="eyebrow mb-1.5">// filter</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        {activeFilter}
                      </h2>
                      <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                        [{String(filteredBooks.length).padStart(2, "0")}]
                      </span>
                    </div>
                  </div>
                  {filteredBooks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <p className="eyebrow mb-3">// no results</p>
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
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />}
    </div>
  );
}
