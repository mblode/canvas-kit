import { BASE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export const GET = () =>
  Response.json({
    $schema:
      "https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/schema/server-card.json",
    capabilities: {},
    description:
      "Web design course covering typography, animation, craft, and copywriting.",
    serverInfo: {
      name: "Blode Course",
      version: "1.0.0",
    },
    url: BASE_URL,
  });
