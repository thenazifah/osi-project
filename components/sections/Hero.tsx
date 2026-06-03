"use client";

import { useTranslations } from "next-intl";
import { Anchor, Ship, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroMarquee from "@/components/sections/HeroMarquee";
import { ExportImage } from "@/components/visuals/ExportImage";
import { CargoShipScene } from "@/components/visuals/CargoShipScene";
import { EXPORT_IMAGES } from "@/data/export-images";
import { useSectionObserver } from "@/lib/use-section-observer";
import { useStaggerVisible } from "@/lib/use-stagger-visible";
import { cn } from "@/lib/utils";

export default function Hero() {
  const t = useTranslations("hero");
  const { ref, isVisible } = useSectionObserver();
  const { ref: statsRef, isVisible: statsVisible } = useStaggerVisible();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { icon: Ship, text: t("statCountries") },
    { icon: Anchor, text: t("statProducts") },
    { icon: Shield, text: t("statIso") },
  ];

  return (
    <section
      ref={ref}
      id="hero"
      className={cn(
        "section-animate hero-shell relative min-h-screen border-b border-border",
        isVisible && "is-visible"
      )}
    >
      <div className="hero-grid-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="page-container relative grid min-h-[calc(100vh-76px)] grid-cols-1 lg:grid-cols-12">
        <div className="flex flex-col justify-center py-16 lg:col-span-7 lg:border-r lg:border-border lg:py-24 lg:pr-12">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge variant="export">{t("platformBadge")}</Badge>
            <Badge variant="outline">B2B Export</Badge>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,7.5vw,5rem)] leading-[1.05] text-ink">
            <span className="text-accent-2">{t("headline1")}</span>
            <br />
            {t("headline2")}
            <br />
            {t("headline3")}
          </h1>
          <p className="mt-6 max-w-[520px] font-sans text-[17px] leading-relaxed text-ink-muted">
            {t("body")}
          </p>
          <p className="mt-4 font-sans text-sm text-ink-muted/90">{t("trustLine")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button onClick={() => scrollTo("rfq")}>{t("ctaPrimary")}</Button>
            <Button variant="outline" onClick={() => scrollTo("catalog")}>
              {t("ctaSecondary")}
            </Button>
          </div>

          <div
            ref={statsRef}
            className={cn(
              "mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3",
              statsVisible && "stagger-visible"
            )}
          >
            {stats.map(({ icon: Icon, text }) => (
              <Card key={text} className="stagger-item card-interactive bg-surface/90 backdrop-blur-sm">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-tag-bg">
                    <Icon className="h-4 w-4 shrink-0 text-accent-2" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                    {text}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center py-12 lg:col-span-5 lg:py-24 lg:pl-8">
          <div className="relative w-full max-w-md">
            <Card className="overflow-hidden border-border bg-surface p-2 shadow-[0_24px_60px_rgba(11,31,42,0.12)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <ExportImage
                  src={EXPORT_IMAGES.containers}
                  alt={t("imageAlt")}
                  overlay="sea"
                  objectPosition="center 35%"
                  priority
                  className="absolute inset-0"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
                <div className="absolute inset-0 hidden sm:block">
                  <CargoShipScene className="absolute bottom-0 right-0 h-[45%] w-[55%] opacity-90 drop-shadow-lg" />
                </div>
              </div>
            </Card>

            <div className="absolute -bottom-3 -left-3 max-w-[200px] rounded-lg border border-border bg-surface/95 px-4 py-3 shadow-lg backdrop-blur-md md:-left-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-sea">
                {t("imageCaptionLabel")}
              </p>
              <p className="mt-1 font-display text-sm leading-snug text-ink">
                {t("imageCaption")}
              </p>
            </div>

            <div className="absolute -right-2 top-8 hidden rounded-lg border border-accent-2/30 bg-accent px-3 py-2 shadow-md md:block">
              <p className="font-mono text-[10px] uppercase tracking-wider text-bg/70">
                {t("capacityBadge")}
              </p>
              <p className="font-display text-lg font-semibold text-bg">500 MT/yr</p>
            </div>
          </div>
        </div>
      </div>

      <HeroMarquee />
    </section>
  );
}
