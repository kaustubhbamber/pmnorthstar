import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { getAIDecodedArticleBySlug } from "@/lib/ai-decoded";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Byline } from "@/components/Byline";
import { SubscribeForm } from "@/components/SubscribeForm";
import { SidebarShell } from "@/components/SidebarShell";
import { solidColorFor } from "@/lib/category-colors";

// ISR: re-render hourly so a scheduled (future-dated) article goes live on
// its publishedAt date without a redeploy.
export const revalidate = 3600;

// Split rendered HTML at the </p> tag closest to `ratio` through the
// article so we can inject a CTA mid-read. Keeps both halves valid HTML.
function splitHtmlAtParagraph(
  html: string,
  ratio: number,
): [string, string] {
  const positions: number[] = [];
  const closeTag = "</p>";
  let idx = html.indexOf(closeTag);
  while (idx !== -1) {
    positions.push(idx + closeTag.length);
    idx = html.indexOf(closeTag, idx + closeTag.length);
  }
  if (positions.length < 3) return [html, ""];
  const splitIdx =
    positions[Math.max(1, Math.floor(positions.length * ratio))];
  return [html.slice(0, splitIdx), html.slice(splitIdx)];
}

export default function AIDecodedArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getAIDecodedArticleBySlug(params.slug);
  if (!article) notFound();
  const fm = article.frontmatter;

  return (
    <SidebarShell
      backHref="/ai-decoded"
      backLabelDesktop="All AI Decoded"
      shareTitle={fm.title}
      shareText={`${fm.title} (northstar's take)`}
    >
      {/* Hero */}
      <section
        className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10 flex justify-center"
        style={{ borderBottom: "1.5px solid var(--card-border)" }}
      >
        <div className="w-full max-w-4xl">
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: "northstar", href: "/" },
              { label: "AI Decoded", href: "/ai-decoded" },
              { label: fm.title },
            ]}
          />
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className="inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-md"
              style={{
                background: solidColorFor(fm.category),
                color: "#ffffff",
                letterSpacing: "0.12em",
              }}
            >
              {fm.category}
            </span>
            <span className="meta-mono inline-flex items-center gap-1 text-sm">
              <Clock size={12} strokeWidth={1.6} />
              {article.readTime} min read
            </span>
            <span className="meta-mono text-sm">
              {new Date(fm.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6"
            style={{
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            {fm.title}
          </h1>

          <p
            className="text-base sm:text-lg lg:text-xl leading-relaxed mb-6 max-w-3xl"
            style={{ color: "var(--text-muted)" }}
          >
            {fm.excerpt}
          </p>

          <Byline label="Written" date={fm.updatedAt ?? fm.publishedAt} />
        </div>
      </section>

      {/* Hero image */}
      {fm.heroImage && (
        <section
          className="px-4 sm:px-8 lg:px-12 py-8 flex justify-center"
          style={{ borderBottom: "1.5px solid var(--card-border)" }}
        >
          <div className="w-full max-w-4xl">
            <figure>
              <img
                src={fm.heroImage.src}
                alt={fm.heroImage.alt}
                width={1600}
                height={900}
                loading="eager"
                className="w-full h-auto rounded-xl"
                style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
              />
              {fm.heroImage.credit && (
                <figcaption
                  className="text-xs mt-2"
                  style={{ color: "var(--text-faint)" }}
                >
                  {fm.heroImage.credit}
                </figcaption>
              )}
            </figure>
          </div>
        </section>
      )}

      {/* Article body — split at ~40% to inject a newsletter CTA mid-read */}
      {(() => {
        const [firstHalf, secondHalf] = splitHtmlAtParagraph(
          article.htmlContent,
          0.4,
        );
        return (
          <>
            <section
              className="px-4 sm:px-8 lg:px-12 pt-10 sm:pt-14 flex justify-center"
              style={
                secondHalf
                  ? undefined
                  : { borderBottom: "1.5px solid var(--card-border)", paddingBottom: "2.5rem" }
              }
            >
              <div
                className="w-full max-w-4xl article-prose"
                dangerouslySetInnerHTML={{ __html: firstHalf }}
              />
            </section>
            {secondHalf && (
              <>
                <section className="px-4 sm:px-8 lg:px-12 py-8 flex justify-center">
                  <div className="w-full max-w-4xl">
                    <SubscribeForm
                      variant="card"
                      surface="ai-decoded-article"
                      headline="Like this decoded read? Get the next one in your inbox."
                      subhead="One sharp take on the latest in AI for PMs, founders and operators. Every few days. Free."
                    />
                  </div>
                </section>
                <section
                  className="px-4 sm:px-8 lg:px-12 pb-10 sm:pb-14 flex justify-center"
                  style={{ borderBottom: "1.5px solid var(--card-border)" }}
                >
                  <div
                    className="w-full max-w-4xl article-prose"
                    dangerouslySetInnerHTML={{ __html: secondHalf }}
                  />
                </section>
              </>
            )}
          </>
        );
      })()}

      {/* FAQ — AEO surface */}
      {fm.faqs && fm.faqs.length > 0 && (
        <section
          className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14 flex justify-center"
          style={{ borderBottom: "1.5px solid var(--card-border)" }}
        >
          <div className="w-full max-w-4xl">
            <h2
              className="text-2xl sm:text-3xl font-semibold mb-6"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Frequently asked
            </h2>
            <div className="space-y-5">
              {fm.faqs.map((faq, i) => (
                <div key={i}>
                  <h3
                    className="text-base sm:text-lg font-semibold mb-2"
                    style={{
                      color: "var(--text-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {faq.question}
                  </h3>
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </SidebarShell>
  );
}
