import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/sections/Footer";
import { ProductSpecsView } from "@/components/catalog/ProductSpecsView";
import {
  getCatalogProductBySlug,
  getCatalogProductSlugs,
  getCatalogProducts,
  getPublicSiteSettings,
} from "@/lib/cms";
import { getPublicSocialLinkItems } from "@/lib/social-links";
import { routing } from "@/i18n/routing";
import type { LocaleCode } from "@/lib/admin-types";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getCatalogProductSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getCatalogProductBySlug(locale as LocaleCode, slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: `${product.name} | OSI`,
    description: product.description,
  };
}

export default async function ProductSpecsPage({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!routing.locales.includes(locale as "en" | "ja" | "zh")) {
    notFound();
  }

  const code = locale as LocaleCode;
  const product = await getCatalogProductBySlug(code, slug);
  if (!product) {
    notFound();
  }

  const [allProducts, siteSettings] = await Promise.all([
    getCatalogProducts(code),
    getPublicSiteSettings(),
  ]);
  const socialLinks = getPublicSocialLinkItems(siteSettings);
  const related = allProducts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.category === product.category)
    .concat(allProducts.filter((p) => p.slug !== slug && p.category !== product.category))
    .slice(0, 3);

  return (
    <>
      <main>
        <ProductSpecsView product={product} locale={locale} related={related} />
      </main>
      <Footer socialLinks={socialLinks} />
    </>
  );
}
