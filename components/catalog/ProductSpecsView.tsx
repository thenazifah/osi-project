import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  FileCheck,
  Microscope,
  Package,
  Ruler,
  Ship,
} from "lucide-react";
import { ProductImageGallery } from "@/components/catalog/ProductImageGallery";
import { ProductCover } from "@/components/catalog/ProductCover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CatalogProduct } from "@/lib/cms";
import { cn } from "@/lib/utils";

type ProductSpecsViewProps = {
  product: CatalogProduct;
  locale: string;
  related: CatalogProduct[];
};

const SPEC_ICONS = [Droplets, Ruler, Microscope, Package] as const;

export async function ProductSpecsView({
  product,
  locale,
  related,
}: ProductSpecsViewProps) {
  const t = await getTranslations("catalog");
  const tPage = await getTranslations("productPage");

  const galleryImages = product.images.map((src, index) => ({
    src,
    alt: `${product.name} (${index + 1}/${product.images.length})`,
  }));

  const rows = [
    { key: "moisture", value: product.specs.moisture },
    { key: "particleSize", value: product.specs.particleSize },
    { key: "microbiology", value: product.specs.microbiology },
    { key: "packaging", value: product.specs.packaging },
  ] as const;

  return (
    <>
      <div className="nav-header border-b border-white/10">
        <div className="page-container py-4 lg:py-5">
          <Link
            href={`/${locale}#catalog`}
            className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium text-bg/80 transition-colors hover:text-bg"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            {tPage("backToCatalog")}
          </Link>
          <p className="section-label mt-2.5 text-bg/50">{tPage("label")}</p>
          <h1 className="mt-1.5 max-w-4xl font-display text-[clamp(1.25rem,2.5vw,1.875rem)] leading-snug text-bg">
            {product.name}
          </h1>
        </div>
      </div>

      <article className="page-container py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_8px_32px_rgba(11,31,42,0.06)]">
              <ProductImageGallery
                images={galleryImages}
                category={product.category}
                className="rounded-none rounded-t-xl"
              />
              <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                {[
                  {
                    icon: Package,
                    label: tPage("moqLabel"),
                    value: t("moq", { kg: product.moqKg }),
                  },
                  {
                    icon: FileCheck,
                    label: tPage("categoryLabel"),
                    value: t(`categories.${product.category}`),
                  },
                  {
                    icon: Ship,
                    label: tPage("exportLabel"),
                    value: tPage("exportReady"),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center px-2 py-4 text-center">
                    <Icon className="h-4 w-4 text-accent-2" strokeWidth={1.5} />
                    <span className="mt-2 font-mono text-[9px] uppercase tracking-wider text-sea">
                      {label}
                    </span>
                    <span className="mt-1 font-sans text-[11px] font-medium leading-snug text-ink">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Badge variant="secondary" className="w-fit">
              {t(`categories.${product.category}`)}
            </Badge>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink-muted lg:text-lg">
              {product.description}
            </p>
            <p className="mt-4 font-mono text-[11px] text-sea">
              {tPage("productId")}: {product.id}
            </p>

            <Separator className="my-10" />

            <div>
              <h2 className="font-display text-xl text-ink md:text-2xl">
                {tPage("specifications")}
              </h2>
              <p className="mt-2 font-sans text-sm text-ink-muted">
                {t("specsSheet.title")}
              </p>
              <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {rows.map(({ key, value }, index) => {
                  const Icon = SPEC_ICONS[index];
                  return (
                    <Card
                      key={key}
                      className="card-interactive overflow-hidden border-border bg-surface"
                    >
                      <CardContent className="p-5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-tag-bg">
                          <Icon className="h-4 w-4 text-accent-2" strokeWidth={1.5} />
                        </div>
                        <dt className="mt-4 font-mono text-[10px] uppercase tracking-wider text-sea">
                          {t(`specsSheet.${key}`)}
                        </dt>
                        <dd className="mt-2 font-sans text-sm leading-relaxed text-ink">
                          {value}
                        </dd>
                      </CardContent>
                    </Card>
                  );
                })}
              </dl>
              <p className="mt-6 rounded-lg border border-border bg-tag-bg/60 px-4 py-3 font-sans text-sm leading-relaxed text-ink-muted">
                {t("specsSheet.note")}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="primary" asChild>
                <Link href={`/${locale}#rfq`}>
                  {t("specsSheet.requestCta")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}#catalog`}>{tPage("browseCatalog")}</Link>
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <div className="mt-16 border-t border-border pt-14">
            <h2 className="font-display text-xl text-ink md:text-2xl">
              {tPage("relatedTitle")}
            </h2>
            <p className="mt-2 font-sans text-sm text-ink-muted">
              {tPage("relatedSubtitle")}
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/products/${item.slug}`}
                  className={cn(
                    "group overflow-hidden rounded-xl border border-border bg-surface transition-all duration-200",
                    "hover:border-accent/30 hover:shadow-[0_8px_24px_rgba(11,31,42,0.08)]"
                  )}
                >
                  {item.images[0] ? (
                    <div className="relative aspect-video w-full overflow-hidden bg-tag-bg">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-opacity duration-200 group-hover:opacity-95"
                      />
                    </div>
                  ) : (
                    <ProductCover
                      category={item.category}
                      className="rounded-none rounded-t-xl transition-opacity duration-200 group-hover:opacity-95"
                    />
                  )}
                  <div className="p-4">
                    <Badge variant="secondary" className="text-[10px]">
                      {t(`categories.${item.category}`)}
                    </Badge>
                    <p className="mt-2 font-display text-sm font-semibold text-ink group-hover:text-accent">
                      {item.name}
                    </p>
                    <p className="mt-2 font-mono text-[11px] text-sea">
                      {t("viewDetails")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </>
  );
}
