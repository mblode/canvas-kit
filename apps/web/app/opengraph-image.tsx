import { renderZoneOgImage } from "@/app/og-image-shared";
import { OgLogo } from "@/app/og-logo";
import { OG_IMAGE_ALT, SITE_NAME } from "@/lib/constants";

export {
  OG_CONTENT_TYPE as contentType,
  OG_SIZE as size,
} from "@/app/og-image-shared";

export const alt = OG_IMAGE_ALT;

/**
 * The house card (Rule 12), replacing the bespoke dark ImageResponse.
 */
export default function OpengraphImage() {
  return renderZoneOgImage({
    background: "#111111",
    color: "#ffffff",
    logo: <OgLogo />,
    title: SITE_NAME,
  });
}
