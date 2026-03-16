import { type MetadataRoute } from "next";

import { env } from "@/configs/env.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_SITE_NAME;

  // Static routes
  const staticRoutes = ["/", "/register"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
