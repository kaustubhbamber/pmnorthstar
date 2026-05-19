import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Strip invisible Unicode characters (non-breaking space, zero-width space,
// BOM) that occasionally end up in pasted URLs and turn legitimate paths
// into 404s. Observed in Vercel Analytics: /%C2%A0 (URL-encoded nbsp).
// Sources are usually external — Notion / Slack / Twitter copy-paste,
// not anything we generate.
const INVISIBLE_CHARS = /%C2%A0|%E2%80%8B|%EF%BB%BF/gi;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!INVISIBLE_CHARS.test(pathname)) return;
  const cleaned = pathname.replace(INVISIBLE_CHARS, "");
  const url = req.nextUrl.clone();
  url.pathname = cleaned || "/";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
