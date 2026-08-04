import { BASE_URL } from "@/lib/constants";

export const GET = () =>
  Response.json(
    {
      linkset: [
        {
          anchor: `${BASE_URL}/`,
          "service-doc": [
            {
              href: `${BASE_URL}/llms.txt`,
              type: "text/plain",
            },
            {
              href: `${BASE_URL}/llms-full.txt`,
              type: "text/plain",
            },
          ],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/linkset+json" },
    }
  );
