import type { MetadataRoute } from "next";

import { getAllPostsMeta, getAllTags } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://diarioteq.vercel.app";
  const now = new Date();

  const baseRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now },
    { url: `${siteUrl}/blog`, lastModified: now },
    { url: `${siteUrl}/tags`, lastModified: now },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPostsMeta().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map((entry) => ({
    url: `${siteUrl}/tags/${entry.tag}`,
    lastModified: now,
  }));

  return [...baseRoutes, ...postRoutes, ...tagRoutes];
}
