import { sampleMajors, sampleUniversities } from "@/lib/sampleData";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://5grade-university-finder.vercel.app").replace(/\/$/, "");
const lastModified = "2026-07-08T00:00:00.000Z";

type SitemapEntry = {
  path: string;
  priority: string;
  changeFrequency: "weekly" | "monthly";
};

const staticPages: SitemapEntry[] = [
  { path: "/", priority: "1.0", changeFrequency: "weekly" },
  { path: "/input", priority: "0.9", changeFrequency: "weekly" },
  { path: "/results", priority: "0.7", changeFrequency: "weekly" }
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sitemapUrl({ path, priority, changeFrequency }: SitemapEntry) {
  return [
    "  <url>",
    `    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>`,
    `    <lastmod>${lastModified}</lastmod>`,
    `    <changefreq>${changeFrequency}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>"
  ].join("\n");
}

export const dynamic = "force-static";

export function GET() {
  const universityPages = sampleUniversities.map((university) => ({
    path: `/universities/${university.id}`,
    priority: "0.75",
    changeFrequency: "monthly" as const
  }));
  const majorPages = sampleMajors.map((major) => ({
    path: `/majors/${major.id}`,
    priority: "0.7",
    changeFrequency: "monthly" as const
  }));
  const entries = [...staticPages, ...universityPages, ...majorPages];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries.map(sitemapUrl).join("\n"),
    "</urlset>"
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}
