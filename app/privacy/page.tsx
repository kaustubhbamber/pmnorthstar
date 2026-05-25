import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pmnorthstar.in";
const LAST_UPDATED = "2026-05-24";

export const metadata: Metadata = {
  title: "Privacy Policy, northstar",
  description:
    "How northstar handles data. We collect almost none, share less, and never sell anything. Plain-language privacy policy.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--page-bg)" }}
    >
      <main className="flex-1">
        <section
          className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14"
          style={{ borderBottom: "1.5px solid var(--card-border)" }}
        >
          <div className="max-w-3xl">
            <Breadcrumbs
              className="mb-5"
              items={[
                { label: "northstar", href: "/" },
                { label: "Privacy" },
              ]}
            />
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={14} strokeWidth={1.6} />
              Back to the library
            </Link>
            <h1
              className="text-3xl sm:text-5xl font-bold leading-[1.05] mb-4"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              Privacy Policy
            </h1>
            <p
              className="text-sm font-mono"
              style={{ color: "var(--text-faint)" }}
            >
              Last updated {LAST_UPDATED}
            </p>
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
          <div
            className="max-w-3xl space-y-8"
            style={{ color: "var(--text-muted)" }}
          >
            <Block title="The short version">
              <p>
                northstar is a free, curated library of books, case studies,
                and playlists. We collect the bare minimum needed to make the
                site work, never sell anything to anyone, and you can read
                everything here without an account.
              </p>
            </Block>

            <Block title="What we collect">
              <p>
                If you create an account: your email, your chosen display
                name, and a hashed password. We use this to let you save and
                like resources across devices, and to email you password
                resets.
              </p>
              <p className="mt-3">
                If you subscribe to the newsletter via the embedded form:
                that signup goes directly to Substack, not to us. Substack&apos;s
                privacy policy applies there.
              </p>
              <p className="mt-3">
                We record the timestamp of your most recent login so we can
                tell, in aggregate, how the site is being used. Nothing
                granular, just a single &ldquo;last seen&rdquo; date per account.
              </p>
            </Block>

            <Block title="Analytics">
              <p>
                We use Vercel Analytics, which is privacy-preserving by
                design: no cookies, no cross-site tracking, no personally
                identifying data. It tells us aggregate page views and
                anonymous events (e.g. &ldquo;how many people clicked share&rdquo;) so
                we know what content is useful. We can&apos;t tie any of this
                back to you as an individual.
              </p>
            </Block>

            <Block title="Cookies">
              <p>
                A single cookie: an authentication token, set only after you
                log in. It expires automatically and is removed when you log
                out. No marketing cookies, no third-party trackers.
              </p>
            </Block>

            <Block title="Affiliate links">
              <p>
                Book pages include Amazon affiliate links. If you buy
                something through one, Amazon pays us a small commission at
                no extra cost to you. We don&apos;t share any information about
                you with Amazon, they only know that the click came from
                pmnorthstar.in. Affiliate revenue funds the site so it can
                stay free and paywall-less.
              </p>
            </Block>

            <Block title="What we never do">
              <p>
                We never sell your data. We never share your email with
                third parties. We don&apos;t run advertising. We don&apos;t use
                fingerprinting or session-replay tools. We don&apos;t share what
                you save or like with anyone else.
              </p>
            </Block>

            <Block title="Your rights">
              <p>
                You can delete your account at any time, which removes your
                email, name, password hash, saved items, and likes from our
                database. To do this, contact us via the channels on the{" "}
                <Link
                  href="/about"
                  style={{ color: "var(--brand-primary)" }}
                  className="underline"
                >
                  About page
                </Link>
                .
              </p>
            </Block>

            <Block title="Changes to this policy">
              <p>
                If we change this policy meaningfully we&apos;ll update the date
                at the top and, if you have an account, send you an email.
              </p>
            </Block>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2
        className="text-xl sm:text-2xl font-semibold mb-3"
        style={{
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      <div className="text-base leading-relaxed">{children}</div>
    </div>
  );
}
