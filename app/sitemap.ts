import type { MetadataRoute } from "next";

const BASE = "https://paintforge-ai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Public marketing routes that exist in /app. Console is intentionally
  // excluded (see robots.ts) as a gated product preview.
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/technology", priority: 0.9, changeFrequency: "monthly" },
    { path: "/solutions", priority: 0.8, changeFrequency: "monthly" },
    { path: "/raas", priority: 0.9, changeFrequency: "monthly" },
    { path: "/saas", priority: 0.9, changeFrequency: "monthly" },
    { path: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    { path: "/resources", priority: 0.7, changeFrequency: "monthly" },
    { path: "/dashboard", priority: 0.5, changeFrequency: "monthly" },
    { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
