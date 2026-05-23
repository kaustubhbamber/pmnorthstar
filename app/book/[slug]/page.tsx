"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/MobileNav";
import { SubscribeForm } from "@/components/SubscribeForm";
import { SmartEngagementBlock } from "@/components/SmartEngagementBlock";
import { ShareButton } from "@/components/ShareButton";
import { Footer } from "@/components/Footer";
import { getCategoryColor } from "@/lib/category-colors";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BookFaqs } from "@/components/BookFaqs";
import { getBookFaqs } from "@/data/bookFaqs";
import { Byline } from "@/components/Byline";
import { SITE_LAST_REVIEWED } from "@/lib/site";
import {
  books,
  getBookSlug,
  getBookBySlug,
  getAmazonAffiliateUrl,
} from "@/data/books";
import { caseStudies, getCaseStudySlug } from "@/data/caseStudies";
import { ArrowLeft, ArrowUpRight, BookOpen, Menu, Star, ShoppingCart } from "lucide-react";

interface AuthorPhotoState {
  url: string | null;
  failed: boolean;
}

export default function BookPage({ params }: { params: { slug: string } }) {
  const book = getBookBySlug(params.slug, books);
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const [authorPhoto, setAuthorPhoto] = useState<AuthorPhotoState>({ url: null, failed: false });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Wikipedia author photo fallback (same hook idea as ResourceCard, inlined)
  useEffect(() => {
    if (!book) return;
    if (typeof window === "undefined") return;
    const cacheKey = `pmnorthstar:author-photo:${book.author}`;
    const cached = window.localStorage.getItem(cacheKey);
    if (cached === "none") {
      setAuthorPhoto({ url: null, failed: true });
      return;
    }
    if (cached) {
      setAuthorPhoto({ url: cached, failed: false });
      return;
    }
    let cancelled = false;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(book.author)}`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        const src = data?.thumbnail?.source;
        if (src) {
          window.localStorage.setItem(cacheKey, src);
          setAuthorPhoto({ url: src, failed: false });
        } else {
          window.localStorage.setItem(cacheKey, "none");
          setAuthorPhoto({ url: null, failed: true });
        }
      })
      .catch(() => {
        if (!cancelled) {
          window.localStorage.setItem(cacheKey, "none");
          setAuthorPhoto({ url: null, failed: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [book]);

  if (!book) notFound();

  const handleNavChange = (nav: string) => {
    if (nav === "home" || nav === "library") router.push("/");
    else router.push(`/#${nav}`);
  };

  const amazonUrl = getAmazonAffiliateUrl(book);
  const cat = getCategoryColor(book.category);
  const faqs = getBookFaqs(book);

  // Related books (same category, different book)
  const relatedBooks = books
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 4);

  // Pull related case studies if specified in the summary
  const relatedCaseStudies = (book.summary?.relatedCaseStudies || [])
    .map((id) => caseStudies.find((c) => c.id === id))
    .filter(Boolean) as typeof caseStudies;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--page-bg)" }}
    >
      <Sidebar
        activeNav="home"
        onNavChange={handleNavChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="flex-shrink-0 px-4 sm:px-6 py-3 flex items-center justify-between gap-3"
          style={{
            background: "var(--nav-bg)",
            borderBottom: "1px solid var(--card-border)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg lg:hidden flex-shrink-0"
              style={{ color: "var(--text-primary)" }}
            >
              <Menu size={20} />
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={14} strokeWidth={1.6} />
              <span className="hidden sm:inline">All books</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </header>

        <MobileNav activeNav="" onNavChange={handleNavChange} />

        <main className="flex-1 overflow-y-auto scroll-container">
          {/* Hero */}
          <section
            className="dot-grid px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl">
              <Breadcrumbs
                className="mb-5"
                items={[
                  { label: "northstar", href: "/" },
                  { label: "Books", href: "/#books-section" },
                  { label: book.category, href: "/#books-section" },
                  { label: book.title },
                ]}
              />
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                  style={{
                    background: cat.bg,
                    color: cat.color,
                    border: `1px solid ${cat.border}`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: cat.color }}
                  />
                  {book.category}
                </span>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                  {book.year} · {book.pages} pages
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] mb-3"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                {book.title}
              </h1>
              <p
                className="text-base sm:text-lg mb-5"
                style={{ color: "var(--text-muted)" }}
              >
                by {book.author}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    strokeWidth={1.6}
                    style={{
                      color: i < Math.floor(book.rating) ? "var(--brand-primary)" : "var(--text-faint)",
                      fill: i < Math.floor(book.rating) ? "var(--brand-primary)" : "transparent",
                    }}
                  />
                ))}
                <span
                  className="text-xs ml-1"
                  style={{ color: "var(--text-faint)" }}
                >
                  {book.rating.toFixed(1)}
                </span>
              </div>

              <p
                className="text-base sm:text-lg leading-relaxed mb-7 max-w-xl"
                style={{ color: "var(--text-primary)", opacity: 0.9 }}
              >
                {book.description}
              </p>

              {/* Primary CTAs — two routes: short (our analysis) or long (buy the book) */}
              <div className="flex flex-wrap items-center gap-2.5">
                {book.summary && (
                  <a href="#short-route" className="btn-primary group">
                    The short route
                    <ArrowUpRight
                      size={12}
                      strokeWidth={1.8}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                )}
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={book.summary ? "btn-accent-soft group" : "btn-accent group"}
                >
                  <ShoppingCart size={14} strokeWidth={1.8} />
                  The long route — Buy on Amazon
                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.8}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
                <ShareButton
                  title={`${book.title} by ${book.author} — northstar review`}
                  text={`${book.title} by ${book.author}: ${book.description} — northstar's review`}
                  variant="prominent"
                />
              </div>

              <p className="text-[11px] mt-3" style={{ color: "var(--text-faint)" }}>
                The short route — our review and key takeaways, 5 min read. The long route — buy the book on Amazon if you want to go deeper. Both routes work.
              </p>
            </div>
          </section>

          {/* Two-column: author photo + tags */}
          <section
            className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 sm:gap-7 items-start">
              <div className="flex-shrink-0">
                {/* Author avatar slot — fixed-size box that always reserves
                    space. Initials gradient renders as a base; Wikipedia
                    photo overlays absolutely when (and if) it loads, so
                    there's no CLS from the swap. */}
                <div
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden"
                  style={{
                    aspectRatio: "1 / 1",
                    background:
                      "linear-gradient(135deg, var(--brand-primary), #8B0000)",
                    border: "2px solid var(--card-bg)",
                    boxShadow: "0 0 0 1px var(--card-border)",
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white">
                    {book.author
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  {authorPhoto.url && !authorPhoto.failed && (
                    <img
                      src={authorPhoto.url}
                      alt={`${book.author} — author of ${book.title}`}
                      loading="lazy"
                      width={112}
                      height={112}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div>
                <p
                  className="eyebrow mb-2"
                  style={{ color: "var(--brand-primary)" }}
                >
                  About the author
                </p>
                <p
                  className="text-lg sm:text-xl font-semibold mb-3"
                  style={{
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {book.author}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--tag-bg)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Summary section — "The short route" */}
          <section
            id="short-route"
            className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
            style={{ borderBottom: "1px solid var(--card-border)" }}
          >
            <div className="max-w-3xl">
              <p
                className="eyebrow mb-3"
                style={{ color: "var(--brand-primary)", opacity: 0.85 }}
              >
                The short route
              </p>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-3"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                northstar's take on this book
              </h2>
              <div className="mb-7">
                <Byline label="Reviewed" date={SITE_LAST_REVIEWED} />
              </div>

              {book.summary ? (
                <div className="space-y-6 sm:space-y-7">
                  {/* Analysis — multi-paragraph original commentary.
                      Engagement block injected at ~40% so anonymous readers
                      see newsletter; engaged users see related-book recs. */}
                  <div className="space-y-4">
                    {book.summary.analysis.map((para, i) => {
                      const injectAfter = Math.max(2, Math.floor(book.summary!.analysis.length * 0.4));
                      return (
                        <div key={i}>
                          <p
                            className="text-sm sm:text-base leading-relaxed"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {para}
                          </p>
                          {i === injectAfter && (
                            <div className="my-6">
                              <SmartEngagementBlock
                                fromType="book"
                                fromSlug={getBookSlug(book)}
                                newsletterHeadline="Like this review? Get the next book breakdown in your inbox."
                                newsletterSubhead="One book or case study every few days — the short route, with the takeaways and our honest read. Free."
                                recommendations={relatedBooks.slice(0, 3).map((b) => ({
                                  type: "book",
                                  slug: getBookSlug(b),
                                  title: b.title,
                                  eyebrow: `${b.category} · ${b.author}`,
                                  href: `/book/${getBookSlug(b)}`,
                                }))}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Key concepts */}
                  <div>
                    <h3
                      className="text-base sm:text-lg font-semibold mb-3"
                      style={{
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Key concepts
                    </h3>
                    <ul className="space-y-3">
                      {book.summary.keyConcepts.map((c, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm sm:text-base leading-relaxed"
                        >
                          <span
                            className="flex-shrink-0 mt-2 w-1 h-1 rounded-full"
                            style={{ background: "var(--brand-primary)" }}
                          />
                          <span>
                            <span
                              className="font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {c.name}
                            </span>
                            <span style={{ color: "var(--text-muted)" }}>
                              {" — "}
                              {c.explanation}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Who should read it */}
                  <div>
                    <h3
                      className="text-base sm:text-lg font-semibold mb-2"
                      style={{
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Who should read it
                    </h3>
                    <p
                      className="text-sm sm:text-base leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {book.summary.whoShouldRead}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="surface p-6 sm:p-7"
                  style={{ borderRadius: 12 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen
                      size={18}
                      strokeWidth={1.6}
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Summary coming soon
                    </p>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    We're writing northstar's take on this one — what makes it
                    worth reading, the key concepts it introduces, and who
                    should add it to their shelf. Subscribe to the newsletter
                    to get notified when it's live.
                  </p>
                </div>
              )}

              <div className="mt-8">
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent group"
                >
                  <ShoppingCart size={14} strokeWidth={1.8} />
                  Get the book on Amazon
                  <ArrowUpRight
                    size={12}
                    strokeWidth={1.8}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </section>


          {/* FAQ — captures 'Is X worth reading?' / 'Who should read X?'
              People-Also-Ask surfaces. Generated from the review text. */}
          {faqs.length > 0 && (
            <section
              className="px-4 sm:px-8 lg:px-12"
              style={{ borderBottom: "1px solid var(--card-border)" }}
            >
              <div className="max-w-3xl">
                <BookFaqs faqs={faqs} />
              </div>
            </section>
          )}

          {/* Related case studies (only if summary explicitly links them) */}
          {relatedCaseStudies.length > 0 && (
            <section
              className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
              style={{ borderBottom: "1px solid var(--card-border)" }}
            >
              <div className="max-w-5xl">
                <p
                  className="eyebrow mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  See it in practice
                </p>
                <h2
                  className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6"
                  style={{
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Case studies that demonstrate the ideas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {relatedCaseStudies.map((cs) => (
                    <Link
                      key={cs.id}
                      href={`/case-study/${getCaseStudySlug(cs.id)}`}
                      className="playlist-card surface p-4 group"
                      style={
                        {
                          ["--accent-color" as any]: "var(--brand-primary)",
                        } as React.CSSProperties
                      }
                    >
                      <p
                        className="text-[10px] font-medium uppercase tracking-wider mb-1.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {cs.category}
                      </p>
                      <p
                        className="text-sm font-semibold leading-snug line-clamp-2"
                        style={{
                          color: "var(--text-primary)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {cs.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Related books */}
          <section className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
            <div className="max-w-5xl">
              <p
                className="eyebrow mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                More in {book.category}
              </p>
              <h2
                className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Other books in this category
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedBooks.map((b) => (
                  <Link
                    key={b.id}
                    href={`/book/${getBookSlug(b)}`}
                    className="playlist-card surface p-4 sm:p-5 group"
                    style={
                      {
                        ["--accent-color" as any]: "var(--brand-primary)",
                      } as React.CSSProperties
                    }
                  >
                    <p
                      className="text-[10px] font-medium uppercase tracking-wider mb-2"
                      style={{
                        color: "var(--brand-primary)",
                        opacity: 0.85,
                      }}
                    >
                      {b.category}
                    </p>
                    <p
                      className="text-sm font-semibold leading-snug mb-1"
                      style={{
                        color: "var(--text-primary)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {b.title}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      by {b.author}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/" className="btn-ghost inline-flex">
                  Browse all books
                  <ArrowUpRight size={12} strokeWidth={1.6} />
                </Link>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </div>
  );
}
