"use client";

import { useEffect, useState } from "react";

interface UserState {
  loading: boolean;
  isLoggedIn: boolean;
  hasEngaged: boolean; // true if logged in AND saved/liked anything
  userName?: string;
}

// Lightweight hook that fetches user + engagement state for the
// SmartEngagementBlock decision (newsletter vs recommendations).
// Re-fetches on every mount: auth state DOES change mid-session in this
// SPA (login/logout via the modal without a full reload), so a persisted
// module cache would strand engaged/logged-in users on the wrong variant
// until a hard refresh. The calls are cheap and best-effort.
export function useUserState(): UserState {
  const [state, setState] = useState<UserState>({
    loading: true,
    isLoggedIn: false,
    hasEngaged: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          if (!cancelled) setState({ loading: false, isLoggedIn: false, hasEngaged: false });
          return;
        }
        const data = await res.json();
        const user = data?.user;
        if (!user) {
          if (!cancelled) setState({ loading: false, isLoggedIn: false, hasEngaged: false });
          return;
        }
        // Probe saved/liked count to determine engagement.
        const [savedRes, likedRes] = await Promise.all([
          fetch("/api/saved", { credentials: "include" }).catch(() => null),
          fetch("/api/liked", { credentials: "include" }).catch(() => null),
        ]);
        const saved = savedRes && savedRes.ok ? await savedRes.json() : { items: [] };
        const liked = likedRes && likedRes.ok ? await likedRes.json() : { items: [] };
        const engaged =
          (saved?.items?.length ?? 0) > 0 || (liked?.items?.length ?? 0) > 0;
        if (!cancelled) {
          setState({
            loading: false,
            isLoggedIn: true,
            hasEngaged: engaged,
            userName: user.name,
          });
        }
      } catch {
        if (!cancelled) setState({ loading: false, isLoggedIn: false, hasEngaged: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
