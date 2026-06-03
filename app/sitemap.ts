import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SECTIONS = [
  "about",
  "catalog",
  "process",
  "compliance",
  "faq",
  "policy",
  "rfq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://organicscales.com";

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${siteUrl}/${l}`])
        ),
      },
    });

    for (const section of SECTIONS) {
      entries.push({
        url: `${siteUrl}/${locale}#${section}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
