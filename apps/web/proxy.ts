import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { modules } from "@/content/course";

/**
 * Every address the `[module]` and `[module]/[lesson]` routes are allowed to
 * answer. Built from the same `modules` array `generateStaticParams` reads, so
 * it cannot drift from the course.
 */
const coursePaths = new Set(
  modules.flatMap((mod) => [
    `/${mod.slug}`,
    ...mod.lessons.map((lesson) => `/${mod.slug}/${lesson.slug}`),
  ])
);

/**
 * One- and two-segment paths that belong to a real route rather than to the
 * course. `docs` and `demos` are route directories; `opengraph-image` is a
 * generated route the matcher below does not exclude.
 *
 * `/demos/<unknown>` is therefore still a 200 shell, deliberately. Checking it
 * would mean importing `content/demos.ts`, which holds the demo components
 * themselves, and that pulls the whole demo tree into a bundle that runs on
 * every request. The route is `robots: noindex, nofollow` and absent from the
 * sitemap, so nothing indexes it and the trade is not worth paying on the hot
 * path.
 *
 * This list is the cost of the check and the thing most likely to go stale:
 * ADD A TOP-LEVEL ROUTE AND IT MUST BE ADDED HERE, or it 404s. The alternative
 * was worse. `notFound()` cannot set the status on this app, because
 * `cacheComponents` serves an App Shell with a 200 for any param
 * `generateStaticParams` did not return and only then upgrades it, so a course
 * URL that does not exist answered 200 with the not-found body: a soft 404 over
 * an unbounded URL space. The two route segment configs that fix this the
 * normal way, `dynamicParams: false` and `dynamic: "force-dynamic"`, are both
 * rejected at build time under `cacheComponents` on Next 16.3 (the shipped docs
 * still say `dynamicParams: false` works; the compiler disagrees and wins).
 * Recheck on the next Next upgrade and delete this if the segment config comes
 * back.
 */
const RESERVED_SEGMENTS = new Set(["docs", "demos", "opengraph-image"]);

const isUnknownCoursePath = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);

  // Only the depths `[module]` and `[module]/[lesson]` can match. A dot means a
  // file route (`icon.svg`), which is never a course slug.
  if (
    segments.length === 0 ||
    segments.length > 2 ||
    RESERVED_SEGMENTS.has(segments[0]) ||
    pathname.includes(".")
  ) {
    return false;
  }

  return !coursePaths.has(`/${segments.join("/")}`);
};

export const proxy = (request: NextRequest) => {
  const pathname =
    request.nextUrl.pathname.replace(/^\/canvas(?=\/|$)/u, "") || "/";

  if (isUnknownCoursePath(pathname)) {
    // Rewritten to a path no route claims, which is what makes Next answer with
    // a genuine 404 status and its not-found body before any shell is streamed.
    return NextResponse.rewrite(new URL("/_unknown-course-path", request.url), {
      status: 404,
    });
  }

  if (pathname.endsWith(".md")) {
    const cleanPath = pathname.slice(0, -3);
    const segments = cleanPath.split("/").filter(Boolean);

    if (segments.length === 2) {
      return NextResponse.rewrite(
        new URL(
          `/canvas/api/markdown/${segments[0]}/${segments[1]}`,
          request.url
        )
      );
    }
    if (segments.length === 1) {
      return NextResponse.rewrite(
        new URL(`/canvas/api/markdown/${segments[0]}`, request.url)
      );
    }
  }

  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/markdown")) {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 2) {
      return NextResponse.rewrite(
        new URL(
          `/canvas/api/markdown/${segments[0]}/${segments[1]}`,
          request.url
        )
      );
    }
    if (segments.length === 1) {
      return NextResponse.rewrite(
        new URL(`/canvas/api/markdown/${segments[0]}`, request.url)
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
