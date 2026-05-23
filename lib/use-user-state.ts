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
// Cached in module memory for the page lifetime — auth state doesn't
// change mid-session in practice, so no need to re-fetch.
let cache: { fetched: boolean; state: UserState } = {
  fetched: false,
  state: { loading: true, isLoggedIn: false, hasEngaged: false },
};

export function useUserState(): UserState {
  const [state, setState] = useState<UserState>(cache.state);

  useEffect(() => {
    if (cache.fetched) {
      setState(cache.state);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          const next = { loading: false, isLoggedIn: false, hasEngaged: false };
          cache = { fetched: true, state: next };
          if (!cancelled) setState(next);
          return;
        }
        const data = await res.json();
        const user = data?.user;
        if (!user) {
          const next = { loading: false, isLoggedIn: false, hasEngaged: false };
          cache = { fetched: true, state: next };
          if (!cancelled) setState(next);
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
        const next: UserState = {
          loading: false,
          isLoggedIn: true,
          hasEngaged: engaged,
          userName: user.name,
        };
        cache = { fetched: true, state: next };
        if (!cancelled) setState(next);
      } catch {
        const next = { loading: false, isLoggedIn: false, hasEngaged: false };
        cache = { fetched: true, state: next };
        if (!cancelled) setState(next);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
