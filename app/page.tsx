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
import { Sidebar } from "@/components/Sidebar";
import { TopNav } from "@/components/TopNav";
import { ResourceCard } from "@/components/ResourceCard";
import { SectionRow } from "@/components/SectionRow";
import { HeroBanner } from "@/components/HeroBanner";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { AuthModal } from "@/components/AuthModal";
import {
  BookOpen,
  Sparkles,
  Layers,
  TrendingUp,
  TrendingDown,
  LogOut,
  User,
  Bookmark,
  Heart,
  Menu,
  Star,
} from "lucide-react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

const categoryAccents: Record<string, string> = {
  "Product Management": "#F3123C",
  Startups: "#F3123C",
  Management: "#F3123C",
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
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
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

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [activeFilter, setActiveFilter] = useState<"All" | Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCsFilter, setActiveCsFilter] = useState<CaseStudyCategory>("All");

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
  const favouriteBooks = books.filter((b) => likedIds.has(b.id));
  const favouriteStudies = caseStudies.filter((s) => likedIds.has(s.id));

  const savedCount = savedBooks.length + savedStudies.length;
  const favouriteCount = favouriteBooks.length + favouriteStudies.length;

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
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)" }}>Saved for Later</h1>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {savedCount} items saved to read later
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0"
              style={{ background: "var(--brand-soft)", border: "1px solid rgba(243,18,60,0.2)", color: "var(--brand-primary)" }}
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </header>

          <main className="flex-1 overflow-y-auto scroll-container p-4 sm:p-6 pb-12">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Bookmark size={40} style={{ color: "var(--text-faint)" }} />
                <p className="text-base font-semibold mt-4" style={{ color: "var(--text-muted)" }}>Sign in to see your saved items</p>
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
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-faint)" }}>Books</p>
                  {savedBooks.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No saved books yet. Hit 🔖 on any book!</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {savedBooks.map((book) => (
                        <ResourceCard
                          key={book.id}
                          book={book}
                          variant="list"
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(book.id)}
                          initialLiked={likedIds.has(book.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="section-divider my-6" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-faint)" }}>Case Studies</p>
                  {savedStudies.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No saved case studies yet. Hit 🔖 on any case study!</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedStudies.map((study) => (
                        <CaseStudyCard
                          key={study.id}
                          study={study}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(study.id)}
                          initialLiked={likedIds.has(study.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
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
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)" }}>Favourites</h1>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {favouriteCount} items you loved
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0"
              style={{ background: "var(--brand-soft)", border: "1px solid rgba(243,18,60,0.2)", color: "var(--brand-primary)" }}
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </header>

          <main className="flex-1 overflow-y-auto scroll-container p-4 sm:p-6 pb-12">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Heart size={40} style={{ color: "var(--text-faint)" }} />
                <p className="text-base font-semibold mt-4" style={{ color: "var(--text-muted)" }}>Sign in to see your favourites</p>
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
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-faint)" }}>Books</p>
                  {favouriteBooks.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No favourite books yet. Hit ❤️ on any book!</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {favouriteBooks.map((book) => (
                        <ResourceCard
                          key={book.id}
                          book={book}
                          variant="list"
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(book.id)}
                          initialLiked={likedIds.has(book.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="section-divider my-6" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-faint)" }}>Case Studies</p>
                  {favouriteStudies.length === 0 ? (
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>No favourite case studies yet. Hit ❤️ on any case study!</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favouriteStudies.map((study) => (
                        <CaseStudyCard
                          key={study.id}
                          study={study}
                          isLoggedIn={!!user}
                          initialSaved={savedIds.has(study.id)}
                          initialLiked={likedIds.has(study.id)}
                          onAuthRequired={() => setShowAuthModal(true)}
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
                <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Case Studies
                </h1>
                <p className="text-xs mt-0.5 hidden sm:block" style={{ color: "var(--text-muted)" }}>
                  50 real stories — product wins, growth hacks, and failures
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium flex-shrink-0"
              style={{ background: "var(--brand-soft)", border: "1px solid rgba(243,18,60,0.2)", color: "var(--brand-primary)" }}
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </header>

          <main className="flex-1 overflow-y-auto scroll-container p-4 sm:p-6 pb-12">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Layers size={40} style={{ color: "var(--text-faint)" }} />
                <p className="text-base font-semibold mt-4" style={{ color: "var(--text-muted)" }}>Sign in to view case studies</p>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
                  {Object.entries(csStats).map(([cat, count]) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCsFilter(cat as CaseStudyCategory)}
                      className="rounded-xl p-3 text-left transition-all"
                      style={{
                        background: activeCsFilter === cat ? "var(--brand-soft)" : "var(--card-bg)",
                        border: `1px solid ${activeCsFilter === cat ? "rgba(243,18,60,0.3)" : "var(--card-border)"}`,
                      }}
                    >
                      <div className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>{count}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{cat}</div>
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveCsFilter("All")}
                    className="rounded-xl p-3 text-left transition-all"
                    style={{
                      background: activeCsFilter === "All" ? "var(--brand-soft)" : "var(--card-bg)",
                      border: `1px solid ${activeCsFilter === "All" ? "rgba(243,18,60,0.3)" : "var(--card-border)"}`,
                    }}
                  >
                    <div className="text-xl font-bold" style={{ color: "var(--brand-primary)" }}>50</div>
                    <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>All</div>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
                  <div className="w-1 h-5 rounded-full" style={{ background: "var(--brand-primary)" }} />
                  <h2 className="text-sm sm:text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                    {activeCsFilter === "All" ? "All Case Studies" : `${activeCsFilter} Case Studies`}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}>
                    {filteredCaseStudies.length}
                  </span>
                  <div className="ml-auto flex items-center gap-3 sm:gap-4">
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--success)" }}>
                      <TrendingUp size={12} />
                      {filteredCaseStudies.filter((c) => c.category !== "Failure").length} wins
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--danger)" }}>
                      <TrendingDown size={12} />
                      {filteredCaseStudies.filter((c) => c.category === "Failure").length} failures
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCaseStudies.map((study) => (
                    <CaseStudyCard
                      key={study.id}
                      study={study}
                      isLoggedIn={!!user}
                      initialSaved={savedIds.has(study.id)}
                      initialLiked={likedIds.has(study.id)}
                      onAuthRequired={() => setShowAuthModal(true)}
                    />
                  ))}
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
                style={{ background: "linear-gradient(135deg, var(--brand-primary), #8B0000)" }}
              >
                <Star size={12} className="text-white fill-white" />
              </div>
              <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>North</span>
              <span className="font-bold text-sm" style={{ color: "var(--brand-primary)" }}>Star</span>
            </div>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: "var(--brand-soft)", border: "1px solid rgba(243,18,60,0.2)", color: "var(--brand-primary)" }}
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>

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
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {user ? `Welcome back, ${user.name} 👋` : "Sign in to save and like resources"}
          </p>
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setActiveNav("saved")}
                className="flex items-center gap-1.5 text-xs px-2 sm:px-3 py-1.5 rounded-lg"
                style={{ background: "var(--brand-soft)", color: "var(--brand-primary)", border: "1px solid rgba(243,18,60,0.2)" }}
              >
                <Bookmark size={11} />
                <span className="hidden sm:inline">{savedCount}</span> Saved
              </button>
              <button
                onClick={() => setActiveNav("favourites")}
                className="flex items-center gap-1.5 text-xs px-2 sm:px-3 py-1.5 rounded-lg"
                style={{ background: "var(--brand-soft)", color: "var(--brand-primary)", border: "1px solid rgba(243,18,60,0.2)" }}
              >
                <Heart size={11} />
                <span className="hidden sm:inline">{favouriteCount}</span> Favourites
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs px-2 sm:px-3 py-1.5 rounded-lg"
                style={{ background: "var(--tag-bg)", color: "var(--text-muted)", border: "1px solid var(--card-border)" }}
              >
                <LogOut size={11} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              <User size={11} /> Log In / Sign Up
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
              <div className="px-4 sm:px-8 py-12 sm:py-20 text-center">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: "linear-gradient(135deg, var(--brand-primary), #8B0000)" }}
                >
                  <Star size={32} className="text-white fill-white" />
                </div>
                <h1
                  className="text-3xl sm:text-5xl font-bold mb-4"
                  style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
                >
                  Learn Product Management<br />
                  <span style={{ color: "var(--brand-primary)" }}>The Smart Way</span>
                </h1>
                <p
                  className="text-sm sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  A free, curated library of the best books, case studies, and frameworks
                  for aspiring and practicing product managers.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  Get Started — It's Free
                </button>
              </div>

              {/* Stats */}
              <div
                className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto px-4 mb-12 sm:mb-16"
              >
                {[
                  { value: "30", label: "Curated Books" },
                  { value: "50", label: "Case Studies" },
                  { value: "3", label: "Categories" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="text-center p-3 sm:p-4 rounded-xl"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                  >
                    <div className="text-xl sm:text-3xl font-bold" style={{ color: "var(--brand-primary)" }}>{value}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* What's inside */}
              <div className="max-w-2xl mx-auto px-4 mb-12 sm:mb-16">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-6" style={{ color: "var(--text-primary)" }}>
                  What's Inside
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: "📚", title: "Curated Book Library", desc: "30 essential reads across Product Management, Startups, and Management — each with summaries and direct links." },
                    { icon: "📊", title: "50 Case Studies", desc: "Deep dives into how Apple, Spotify, Airbnb, Slack, and 46 more companies built iconic products." },
                    { icon: "🔖", title: "Save & Organize", desc: "Bookmark resources and build your personal reading list. Pick up where you left off." },
                    { icon: "❤️", title: "Favourites", desc: "Mark the resources you love. Your favourites are always one click away." },
                  ].map(({ icon, title, desc }) => (
                    <div
                      key={title}
                      className="p-4 sm:p-5 rounded-xl"
                      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                    >
                      <span className="text-2xl">{icon}</span>
                      <h3 className="text-sm font-semibold mt-2 mb-1" style={{ color: "var(--text-primary)" }}>{title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample case studies preview */}
              <div className="max-w-2xl mx-auto px-4 mb-12 sm:mb-16">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-6" style={{ color: "var(--text-primary)" }}>
                  Featured Case Studies
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {caseStudies.slice(0, 8).map((cs) => (
                    <div
                      key={cs.id}
                      className="p-3 rounded-xl text-center"
                      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                    >
                      <span className="text-2xl block mb-1">{cs.logo}</span>
                      <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{cs.company}</p>
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>{cs.category}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center px-4 pb-12">
                <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                  Free forever. No credit card required.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  Sign Up for Free
                </button>
              </div>
            </div>
          ) : !isFiltered ? (
            <div className="pb-12">
              {heroBook && <HeroBanner onNavChange={setActiveNav} />}

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mx-4 sm:mx-6 mt-4 mb-6">
                {[
                  { label: "Total Books", value: "30", icon: BookOpen },
                  { label: "Case Studies", value: "50", icon: Layers, nav: "casestudies" },
                  { label: "Categories", value: "3", icon: Sparkles },
                ].map(({ label, value, icon: Icon, nav }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl cursor-pointer"
                    style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                    onClick={() => nav && setActiveNav(nav)}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--brand-primary)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--card-border)")}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--brand-soft)" }}>
                      <Icon size={14} style={{ color: "var(--brand-primary)" }} />
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-bold" style={{ color: "var(--text-primary)" }}>{value}</div>
                      <div className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>{label}</div>
                    </div>
                  </div>
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
                        />
                      ))}
                    </SectionRow>
                    <div className="section-divider mt-8" />
                  </div>
                );
              })}

              {/* Case Studies Preview */}
              <div className="px-4 sm:px-6 mt-8 mb-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: "var(--brand-primary)" }} />
                    <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Case Studies</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--brand-soft)", color: "var(--brand-primary)" }}>50</span>
                  </div>
                  <button
                    onClick={() => setActiveNav("casestudies")}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                    style={{ background: "var(--brand-primary)" }}
                  >
                    View All 50 →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {caseStudies.slice(0, 6).map((study) => (
                    <CaseStudyCard
                      key={study.id}
                      study={study}
                      isLoggedIn={!!user}
                      initialSaved={savedIds.has(study.id)}
                      initialLiked={likedIds.has(study.id)}
                      onAuthRequired={() => setShowAuthModal(true)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6 pb-12">
              <div className="mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {searchQuery ? `Results for "${searchQuery}"` : activeFilter}
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {filteredBooks.length} book{filteredBooks.length !== 1 ? "s" : ""} found
                </p>
              </div>
              {filteredBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen size={40} style={{ color: "var(--text-faint)" }} />
                  <p className="text-base font-semibold mt-4" style={{ color: "var(--text-muted)" }}>No books found</p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-faint)" }}>Try a different search or category</p>
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
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(u) => setUser(u)} />}
    </div>
  );
}
