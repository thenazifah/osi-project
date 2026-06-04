import type { MetadataRoute } from "next";
import { products } from "@/data/products";
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

    for (const product of products) {
      entries.push({
        url: `${siteUrl}/${locale}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
