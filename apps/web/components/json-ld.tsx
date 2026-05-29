/**
 * Renders a JSON-LD structured-data script. The payload is a plain schema
 * object, `JSON.stringify` produces safe output, so there is no user HTML.
 */
export const JsonLd = ({ data }: { data: Record<string, unknown> }) => (
  <script
    // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized schema object, not user input
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    type="application/ld+json"
  />
);
