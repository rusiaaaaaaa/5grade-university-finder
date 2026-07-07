import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://5grade-university-finder.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/methodology"]
    },
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/google-sitemap.xml`]
  };
}
