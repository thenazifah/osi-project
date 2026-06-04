"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ProductCover } from "@/components/catalog/ProductCover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CatalogProduct } from "@/lib/cms";
import type { ProductCategory } from "@/data/products";
import { useSectionObserver } from "@/lib/use-section-observer";
import { useStaggerVisible } from "@/lib/use-stagger-visible";
import { cn } from "@/lib/utils";

type FilterKey = "all" | ProductCategory;

const FILTERS: { key: FilterKey; labelKey: string }[] = [
  { key: "all", labelKey: "filterAll" },
  { key: "tilapia", labelKey: "filterTilapia" },
  { key: "carp", labelKey: "filterCarp" },
  { key: "marine", labelKey: "filterMarine" },
  { key: "custom", labelKey: "filterCustom" },
];

function isExternalSpecsUrl(url?: string): url is string {
  return Boolean(url && /^https?:\/\//i.test(url));
}

function ProductGrid({
  filter,
  locale,
  items,
}: {
  filter: FilterKey;
  locale: string;
  items: CatalogProduct[];
}) {
  const t = useTranslations("catalog");
  const { ref, isVisible } = useStaggerVisible();
  const filtered =
    filter === "all" ? items : items.filter((p) => p.category === filter);

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        isVisible && "stagger-visible"
      )}
    >
      {filtered.map((product) => {
        const externalSpecs = isExternalSpecsUrl(product.specsUrl);
        const internalSpecsHref = `/${locale}/products/${product.slug}`;

        return (
          <Card
            key={product.id}
            className="stagger-item card-interactive overflow-hidden bg-bg"
          >
            {product.images[0] ? (
              <div className="relative aspect-video w-full overflow-hidden bg-tag-bg">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <ProductCover category={product.category} />
            )}
            <CardHeader className="pb-2">
              <Badge variant="secondary" className="w-fit">
                {t(`categories.${product.category}`)}
              </Badge>
              <CardTitle className="mt-2 text-base">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="line-clamp-2 font-sans text-sm leading-relaxed text-ink-muted">
                {product.description}
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <Badge variant="outline">{t("moq", { kg: product.moqKg })}</Badge>
              {externalSpecs ? (
                <Button variant="primary" size="sm" className="shrink-0" asChild>
                  <a
                    href={product.specsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("viewDetails")}
                  </a>
                </Button>
              ) : (
                <Button variant="primary" size="sm" className="shrink-0" asChild>
                  <Link href={internalSpecsHref}>{t("viewDetails")}</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default function Catalog({ items }: { items: CatalogProduct[] }) {
  const t = useTranslations("catalog");
  const locale = useLocale();
  const { ref, isVisible } = useSectionObserver();

  return (
    <section
      ref={ref}
      id="catalog"
      className={cn(
        "section-animate section-divider bg-surface",
        isVisible && "is-visible"
      )}
    >
      <div className="page-container py-12 lg:py-20">
        <p className="section-label">{t("label")}</p>
        <h2 className="mt-3 font-display text-2xl text-ink md:text-3xl">
          {t("filterAll")} · {items.length} lines
        </h2>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-ink-muted">
          {t("subtitle")}
        </p>
        <p className="mt-2 font-mono text-[11px] text-sea">{t("specsHint")}</p>

        <Tabs defaultValue="all" className="mt-10">
          <TabsList className="w-full justify-start overflow-x-auto">
            {FILTERS.map(({ key, labelKey }) => (
              <TabsTrigger key={key} value={key}>
                {t(labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>
          {FILTERS.map(({ key }) => (
            <TabsContent key={key} value={key}>
              <ProductGrid filter={key} locale={locale} items={items} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
