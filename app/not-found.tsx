import Link from "next/link";
import { ArrowLeft, BookOpen, Compass } from "lucide-react";
import { Footer } from "@/components/Footer";
import { publishedCaseStudies } from "@/data/caseStudies";

export default function NotFound() {
  const caseStudiesCount = publishedCaseStudies().length;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--page-bg)" }}
    >
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 sm:py-28 dot-grid relative overflow-hidden">
        {/* Brand glow */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: "rgba(243,18,60,0.10)",
            filter: "blur(120px)",
          }}
        />

        <div className="relative z-10 max-w-xl text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <Compass
              size={16}
              strokeWidth={1.6}
              style={{ color: "var(--brand-primary)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--brand-primary)" }}
            >
              northstar · off course
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-7xl font-bold leading-[1.0] mb-5"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.04em",
            }}
          >
            404
          </h1>
          <p
            className="text-lg sm:text-2xl font-semibold mb-3"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            This page got lost in the discovery phase.
          </p>
          <p
            className="text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            The link you followed isn&apos;t a real page on northstar. Could be a
            typo, an old URL, or a paste-mangled link from Slack. Either way —
            you have options.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/" className="btn-primary group">
              <ArrowLeft size={14} strokeWidth={1.8} />
              Back to the library
            </Link>
            <Link href="/#casestudies" className="btn-accent-soft group">
              <BookOpen size={14} strokeWidth={1.8} />
              Browse {caseStudiesCount} case studies
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
