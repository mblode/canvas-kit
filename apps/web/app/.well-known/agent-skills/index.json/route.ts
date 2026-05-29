import { BASE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export const GET = () =>
  Response.json({
    $schema:
      "https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schema/index.json",
    skills: [
      {
        description:
          "65 lessons across typography, animation, craft, copywriting, AI & taste, intersections, and walkthroughs.",
        name: "Web Design Craft Course",
        sha256: "",
        type: "documentation",
        url: `${BASE_URL}/llms-full.txt`,
      },
    ],
  });
