"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSectionObserver } from "@/lib/use-section-observer";
import { useStaggerVisible } from "@/lib/use-stagger-visible";
import { cn } from "@/lib/utils";

const REGIONS = ["asiaPacific", "europe", "middleEast", "americas"] as const;

export default function Markets() {
  const t = useTranslations("markets");
  const { ref, isVisible } = useSectionObserver();
  const { ref: gridRef, isVisible: gridVisible } = useStaggerVisible();

  return (
    <section
      ref={ref}
      id="markets"
      className={cn(
        "section-animate section-divider bg-bg",
        isVisible && "is-visible"
      )}
    >
      <div className="page-container py-16 lg:py-24">
        <p className="section-label">{t("label")}</p>
        <h2 className="mt-4 max-w-2xl whitespace-pre-line font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-ink">
          {t("title")}
        </h2>
        <p className="mt-4 max-w-3xl font-sans text-base leading-relaxed text-ink-muted">
          {t("subtitle")}
        </p>

        <div
          ref={gridRef}
          className={cn(
            "mt-10 grid grid-cols-1 gap-4 md:grid-cols-2",
            gridVisible && "stagger-visible"
          )}
        >
          {REGIONS.map((region) => (
            <Card key={region} className="stagger-item card-interactive">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{t(`regions.${region}.name`)}</CardTitle>
                  <Badge variant="outline">{t(`regions.${region}.count`)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-sans text-sm text-ink-muted">
                  {t(`regions.${region}.description`)}
                </p>
                <Separator className="my-4" />
                <p className="font-mono text-[11px] uppercase tracking-wider text-sea">
                  {t(`regions.${region}.grades`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 card-interactive border-accent/20 bg-tag-bg">
          <CardContent className="p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
              {t("incotermsLabel")}
            </p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
              {t("incoterms")}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
