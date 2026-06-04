import { revalidatePath } from "next/cache";

/** Keep admin pages and public locale routes in sync after CMS changes. */
export function revalidateAdminAndSite(productSlug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/rfq");
  revalidatePath("/admin/products");
  revalidatePath("/admin/content");
  for (const locale of ["en", "ja", "zh"] as const) {
    revalidatePath(`/${locale}`);
    if (productSlug) {
      revalidatePath(`/${locale}/products/${productSlug}`);
    }
  }
}
