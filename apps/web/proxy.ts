import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.endsWith(".md")) {
    const cleanPath = pathname.slice(0, -3);
    const segments = cleanPath.split("/").filter(Boolean);

    if (segments.length === 2) {
      return NextResponse.rewrite(
        new URL(`/api/markdown/${segments[0]}/${segments[1]}`, request.url)
      );
    }
    if (segments.length === 1) {
      return NextResponse.rewrite(
        new URL(`/api/markdown/${segments[0]}`, request.url)
      );
    }
  }

  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/markdown")) {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 2) {
      return NextResponse.rewrite(
        new URL(`/api/markdown/${segments[0]}/${segments[1]}`, request.url)
      );
    }
    if (segments.length === 1) {
      return NextResponse.rewrite(
        new URL(`/api/markdown/${segments[0]}`, request.url)
      );
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/((?!_next|api|favicon\\.ico|apple-icon\\.png|icon[01]\\.|fonts|robots\\.txt|sitemap\\.xml|llms|manifest|\\.well-known).*)",
  ],
};
