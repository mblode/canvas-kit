import { notFound } from "next/navigation";

/**
 * The rewrite target for `proxy.ts`'s unknown-course-path check, and nothing
 * else. Middleware cannot render a 404 itself, and rewriting to a path with no
 * build output makes Vercel answer with its own plain-text `NOT_FOUND` body
 * instead of this app's 404 page. `next start` does not reproduce that: it
 * renders the Next 404 either way, so the difference is only visible in
 * production. Rewriting to a real route that calls `notFound()` keeps the 404
 * status and gets the HTML page back, `noindex` included.
 *
 * Requesting `/gone` directly also 404s, which is the honest answer.
 */
export default function Gone() {
  notFound();
}
