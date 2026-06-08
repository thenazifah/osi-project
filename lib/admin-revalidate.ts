import { revalidatePath } from "next/cache";

const LOCALES = ["en", "ja", "zh"] as const;

function uniqueSlugs(...groups: (string | string[] | undefined)[]): string[] {
  const slugs = new Set<string>();
  for (const group of groups) {
    if (!group) continue;
    const list = Array.isArray(group) ? group : [group];
    for (const slug of list) {
      const trimmed = slug.trim();
      if (trimmed) slugs.add(trimmed);
    }
  }
  return [...slugs];
}

/** Keep admin pages and public locale routes in sync after CMS changes. */
export function revalidateAdminAndSite(
  productSlugs?: string | string[],
  previousSlugs?: string | string[]
) {
  revalidatePath("/admin");
  revalidatePath("/admin/rfq");
  revalidatePath("/admin/products");
  revalidatePath("/admin/content");
  revalidatePath("/admin/site");
  revalidatePath("/sitemap.xml");

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}`, "layout");
  }

  for (const slug of uniqueSlugs(productSlugs, previousSlugs)) {
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}/products/${slug}`);
    }
  }
}
