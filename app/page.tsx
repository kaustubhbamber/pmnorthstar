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

  // When navigated in from another route (e.g. /india) with a hash like
  // #casestudies, set the active tab on mount so the right view loads.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const valid = ["home", "library", "casestudies", "learn", "saved", "favourites"];
    const hash = window.location.hash.replace("#", "");
    if (hash && valid.includes(hash)) setActiveNav(hash);
  }, []);

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
            style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--card-border)" }}
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
                <div className="dot-grid px-4 sm:px-8 py-10 sm:py-14" style={{ borderBottom: "1px solid var(--card-border)" }}>
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
                            {activeCsFilter === "All" ? "All Categories" : activeCsFilter}
                          </span>
                          <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                            {String(filteredCaseStudies.length)}
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 text-[12px]">
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
                  style={{ borderBottom: "1px solid var(--card-border)" }}
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
                    const lnColor = activeLearnFilter === "All" ? undefined : learnCategoryColors[activeLearnFilter];
                    return (
                      <div className="flex items-baseline justify-between mb-5">
                        <div className="flex items-baseline gap-3">
                          <span
                            className="eyebrow"
                            style={lnColor ? { color: lnColor, opacity: 0.85 } : undefined}
                          >
                            {activeLearnFilter === "All" ? "All Topics" : activeLearnFilter}
                          </span>
                          <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                            {String(filteredPlaylists.length)}
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
              <span className="font-display font-bold text-[15px]" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>North</span>
              <span className="font-display font-bold text-[15px]" style={{ color: "var(--brand-primary)", letterSpacing: "-0.02em" }}>Star</span>
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
          <p className="text-[11px] sm:text-xs truncate flex-shrink min-w-0" style={{ color: "var(--text-muted)" }}>
            {user ? `Welcome back, ${user.name}` : "Browse freely. Sign in only if you want to save."}
          </p>
          {user ? (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveNav("saved")}
                className="text-[11px] font-medium inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg"
                style={{ background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-muted)" }}
              >
                <Bookmark size={10} strokeWidth={1.6} />
                <span className="hidden sm:inline">Saved </span><span style={{ color: "var(--text-faint)" }}>{savedCount}</span>
              </button>
              <button
                onClick={() => setActiveNav("favourites")}
                className="text-[11px] font-medium inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg"
                style={{ background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-muted)" }}
              >
                <Heart size={10} strokeWidth={1.6} />
                <span className="hidden sm:inline">Fav </span><span style={{ color: "var(--text-faint)" }}>{favouriteCount}</span>
              </button>
              <button
                onClick={handleLogout}
                className="text-[11px] font-medium inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg"
                style={{ background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-muted)" }}
              >
                <LogOut size={10} strokeWidth={1.6} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          ) : null}
        </div>

        <main className="flex-1 overflow-y-auto scroll-container">
          {authLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "var(--card-border)", borderTopColor: "var(--brand-primary)" }} />
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
                      <span className="text-[11px] font-medium tracking-wider uppercase" style={{ color: "var(--text-faint)" }}>
                        {label.replace("_", " ")}
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
                      {value}
                    </div>
                  </button>
                ))}
              </div>

              {/* Featured Row */}
              <SectionRow title="Latest Picks" subtitle="Hand-curated for product learners" accentColor="#FF6B35">
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
                    <p className="eyebrow mb-1.5" style={{ color: "#F3123C", opacity: 0.85 }}>Case Studies</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-base sm:text-lg font-semibold" style={{ color: "#F3123C", letterSpacing: "-0.02em" }}>
                        Case Studies
                      </h2>
                      <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>[50]</span>
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
                    <p className="eyebrow mb-1.5" style={{ color: "#9B8FFF", opacity: 0.85 }}>Learn</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-base sm:text-lg font-semibold" style={{ color: "#9B8FFF", letterSpacing: "-0.02em" }}>
                        Learn
                      </h2>
                      <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{String(playlists.length)}</span>
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
                    <p className="eyebrow mb-1.5">Search results</p>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        “{searchQuery}”
                      </h2>
                      <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                        {String(filteredBooks.length + searchedCaseStudies.length + searchedPlaylists.length)}
                      </span>
                    </div>
                  </div>

                  {filteredBooks.length + searchedCaseStudies.length + searchedPlaylists.length === 0 ? (
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

                      {/* Playlists group */}
                      {searchedPlaylists.length > 0 && (
                        <div>
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
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="eyebrow mb-1.5">Filter</p>
                    <div className="flex items-baseline gap-3">
                      <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        {activeFilter}
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
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />}
    </div>
  );
}
