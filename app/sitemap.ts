import type { MetadataRoute } from "next";
import { getCatalogProductSlugs } from "@/lib/cms";
import { routing } from "@/i18n/routing";

const SECTIONS = [
  "catalog",
  "about",
  "process",
  "compliance",
  "faq",
  "policy",
  "rfq",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://organicscales.com";
  const productSlugs = await getCatalogProductSlugs();

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

    for (const slug of productSlugs) {
      entries.push({
        url: `${siteUrl}/${locale}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
