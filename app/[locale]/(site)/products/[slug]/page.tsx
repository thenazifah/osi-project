import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import { ProductSpecsView } from "@/components/catalog/ProductSpecsView";
import { getCatalogProductBySlug, getCatalogProducts } from "@/lib/cms";
import { products } from "@/data/products";
import { routing } from "@/i18n/routing";
import type { LocaleCode } from "@/lib/admin-types";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug }))
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

  const allProducts = await getCatalogProducts(code);
  const related = allProducts
    .filter((p) => p.slug !== slug)
    .filter((p) => p.category === product.category)
    .concat(allProducts.filter((p) => p.slug !== slug && p.category !== product.category))
    .slice(0, 3);

  return (
    <>
      <Nav />
      <main>
        <ProductSpecsView product={product} locale={locale} related={related} />
      </main>
      <Footer />
    </>
  );
}
