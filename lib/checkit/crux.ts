// Chrome UX Report (CrUX) API client.
//
// Provides real user-experience field data for Core Web Vitals (LCP,
// INP, CLS). The API returns 75th-percentile metrics aggregated from
// Chrome users over the last 28 days. Free with a Google API key
// (25k queries/day, more than enough for our scale).
//
// For sites without enough traffic to have CrUX data (most vibe-coded
// sites), the API returns 404 and we mark those checks as
// "no field data" — same fail pattern as the original PSI flow.

import { fetchWithTimeout } from "./util";

const CRUX_ENDPOINT = "https://chromeuxreport.googleapis.com/v1/records:queryRecord";
const CRUX_TIMEOUT_MS = 8000;

export interface CruxData {
  // 75th-percentile metrics for the last 28 days. All optional because
  // CrUX only returns metrics it has enough samples for.
  lcpMs?: number;
  inpMs?: number;
  cls?: number;
  ttfbMs?: number;
  fcpMs?: number;
  // True if CrUX returned any data at all for this origin.
  hasData: boolean;
}

interface CruxApiResponse {
  record?: {
    metrics?: Record<string, {
      percentiles?: { p75?: number | string };
    }>;
  };
}

// Read 75th percentile, handling CrUX's quirk of returning strings
// sometimes (CLS) and numbers other times (LCP, INP, TTFB).
function readP75(
  record: CruxApiResponse["record"],
  metric: string,
): number | undefined {
  const raw = record?.metrics?.[metric]?.percentiles?.p75;
  if (raw === undefined) return undefined;
  const n = typeof raw === "string" ? parseFloat(raw) : raw;
  return Number.isFinite(n) ? n : undefined;
}

export async function fetchCrux(
  origin: string,
  formFactor: "PHONE" | "DESKTOP" = "PHONE",
): Promise<CruxData> {
  const apiKey = process.env.GOOGLE_API_KEY;
  // Without an API key, return empty — checks will fall back to a
  // "no field data" message rather than throwing.
  if (!apiKey) {
    return { hasData: false };
  }

  try {
    const res = await fetchWithTimeout(
      `${CRUX_ENDPOINT}?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          formFactor,
          metrics: [
            "largest_contentful_paint",
            "interaction_to_next_paint",
            "cumulative_layout_shift",
            "experimental_time_to_first_byte",
            "first_contentful_paint",
          ],
        }),
      },
      CRUX_TIMEOUT_MS,
    );

    // 404 = no CrUX data for this origin (insufficient traffic).
    // Treat as "no data" rather than an error.
    if (res.status === 404) {
      return { hasData: false };
    }
    if (!res.ok) {
      return { hasData: false };
    }

    const data = (await res.json()) as CruxApiResponse;
    const record = data?.record;

    return {
      hasData: !!record?.metrics,
      lcpMs: readP75(record, "largest_contentful_paint"),
      inpMs: readP75(record, "interaction_to_next_paint"),
      cls: readP75(record, "cumulative_layout_shift"),
      ttfbMs: readP75(record, "experimental_time_to_first_byte"),
      fcpMs: readP75(record, "first_contentful_paint"),
    };
  } catch {
    return { hasData: false };
  }
}

// Normalize a URL to an origin (scheme + host) for the CrUX query.
// CrUX queries by origin, not by full URL.
export function originOf(url: URL): string {
  return `${url.protocol}//${url.host}`;
}
