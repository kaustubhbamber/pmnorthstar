"use client";

import { SubscribeForm } from "@/components/SubscribeForm";
import {
  RecommendationsBlock,
  // re-exported type via inline import below
} from "@/components/RecommendationsBlock";
import { useUserState } from "@/lib/use-user-state";

interface Recommendation {
  type: "case-study" | "book";
  slug: string;
  title: string;
  eyebrow: string;
  href: string;
}

interface SmartEngagementBlockProps {
  // Source page identifying info (for tracking).
  fromType: string;
  fromSlug: string;
  // Newsletter copy when shown to anonymous users.
  newsletterHeadline?: string;
  newsletterSubhead?: string;
  // Recommendations to show to engaged logged-in users.
  recommendations: Recommendation[];
}

// Decides whether to show newsletter signup (anonymous / unengaged
// users — conversion target) or a recommendations block (already-
// engaged logged-in users — already converted; surface more content
// instead). Both surfaces are tracked so we know which is converting.
export function SmartEngagementBlock({
  fromType,
  fromSlug,
  newsletterHeadline,
  newsletterSubhead,
  recommendations,
}: SmartEngagementBlockProps) {
  const { loading, isLoggedIn, hasEngaged } = useUserState();

  // While auth state is loading, render the newsletter form (most
  // users will be anonymous, so it's the safer default for SSR/early
  // hydration). Avoids layout shift when state resolves.
  if (loading || !isLoggedIn || !hasEngaged) {
    return (
      <SubscribeForm
        variant="card"
        headline={newsletterHeadline}
        subhead={newsletterSubhead}
      />
    );
  }

  return (
    <RecommendationsBlock
      fromType={fromType}
      fromSlug={fromSlug}
      items={recommendations}
    />
  );
}
