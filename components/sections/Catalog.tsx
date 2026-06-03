"use client";

import { useTranslations } from "next-intl";
import { ProductCover } from "@/components/catalog/ProductCover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products, type ProductCategory } from "@/data/products";
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

function getProductNameKey(nameKey: string): string {
  const parts = nameKey.split(".");
  return parts[0] ?? nameKey;
}

function ProductGrid({ filter }: { filter: FilterKey }) {
  const t = useTranslations("catalog");
  const { ref, isVisible } = useStaggerVisible();
  const filtered =
    filter === "all"
      ? products
      : products.filter((p) => p.category === filter);

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        isVisible && "stagger-visible"
      )}
    >
      {filtered.map((product) => {
        const productKey = getProductNameKey(product.nameKey);
        return (
          <Card
            key={product.id}
            className="stagger-item card-interactive overflow-hidden bg-bg"
          >
            <ProductCover category={product.category} />
            <CardHeader className="pb-2">
              <Badge variant="secondary" className="w-fit">
                {t(`categories.${product.category}`)}
              </Badge>
              <CardTitle className="mt-2 text-base">
                {t(`${productKey}.name`)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="line-clamp-2 font-sans text-sm leading-relaxed text-ink-muted">
                {t(`${productKey}.description`)}
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
              <Badge variant="outline">{t("moq", { kg: product.moqKg })}</Badge>
              <a
                href={product.specsUrl}
                className="font-mono text-[12px] text-sea transition-colors duration-200 hover:text-accent"
              >
                {t("viewSpecs")}
              </a>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default function Catalog() {
  const t = useTranslations("catalog");
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
          {t("filterAll")} · {products.length} lines
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
              <ProductGrid filter={key} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
