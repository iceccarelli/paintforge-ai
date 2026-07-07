import type { MetadataRoute } from "next";

const BASE = "https://paintforge-ai.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Console/dashboard are product previews, not indexable marketing pages.
      disallow: ["/console", "/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
