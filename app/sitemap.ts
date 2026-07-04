import type { MetadataRoute } from "next";
import { sampleMajors, sampleUniversities } from "@/lib/sampleData";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://5grade-university-finder.vercel.app";

function page(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    page("/", 1, "weekly"),
    page("/input", 0.9, "weekly"),
    page("/results", 0.7, "weekly"),
    ...sampleUniversities.map((university) =>
      page(`/universities/${university.id}`, 0.75, "monthly")
    ),
    ...sampleMajors.map((major) => page(`/majors/${major.id}`, 0.7, "monthly"))
  ];
}
