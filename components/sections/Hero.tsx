"use client";

import { useTranslations } from "next-intl";
import { Anchor, Ship, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroMarquee from "@/components/sections/HeroMarquee";
import { ExportImage } from "@/components/visuals/ExportImage";
import { SocialLinks, type SocialLinkItem } from "@/components/footer/SocialLinks";
import { Reveal } from "@/components/motion/Reveal";
import { resolveExportImageSrc } from "@/data/export-images";
import { useSectionObserver } from "@/lib/use-section-observer";
import { useStaggerVisible } from "@/lib/use-stagger-visible";
import type { SiteContent } from "@/lib/admin-types";
import { cn } from "@/lib/utils";

type HeroProps = {
  content?: SiteContent["hero"];
  heroImage?: string;
  socialLinks?: SocialLinkItem[];
};

export default function Hero({ content, heroImage, socialLinks = [] }: HeroProps) {
  const t = useTranslations("hero");
  const tFooter = useTranslations("footer");
  const h = (key: keyof SiteContent["hero"]) =>
    content?.[key]?.trim() ? content[key] : t(key);
  const { ref, isVisible } = useSectionObserver(0.08);
  const { ref: statsRef, isVisible: statsVisible } = useStaggerVisible();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { icon: Ship, text: t("statCountries") },
    { icon: Anchor, text: t("statProducts") },
    { icon: Shield, text: t("statIso") },
  ];

  const heroSrc = resolveExportImageSrc(heroImage, "heroPort");

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
        <div
          className={cn(
            "flex flex-col justify-center py-16 lg:col-span-6 lg:border-r lg:border-border lg:py-24 lg:pr-10 xl:pr-12",
            isVisible && "hero-stagger-visible"
          )}
        >
          <div className="hero-stagger-item mb-6 flex flex-wrap items-center gap-2">
            <Badge variant="export">{t("platformBadge")}</Badge>
            <Badge variant="outline">B2B Export</Badge>
          </div>
          <h1 className="hero-stagger-item font-display text-[clamp(2rem,6vw,4.25rem)] leading-[1.08] text-ink">
            <span className="text-accent-2">{h("headline1")}</span>
            {h("headline2") ? (
              <>
                <br />
                <span>{h("headline2")}</span>
              </>
            ) : null}
            {h("headline3") ? (
              <>
                <br />
                <span>{h("headline3")}</span>
              </>
            ) : null}
          </h1>
          <p className="hero-stagger-item mt-6 max-w-[520px] font-sans text-[17px] leading-relaxed text-ink-muted">
            {h("body")}
          </p>
          <p className="hero-stagger-item mt-4 font-sans text-sm text-ink-muted/90">
            {h("trustLine")}
          </p>
          <div className="hero-stagger-item mt-10 flex flex-wrap gap-3">
            <Button variant="cta" onClick={() => scrollTo("rfq")}>
              {t("ctaPrimary")}
            </Button>
            <Button variant="outline" onClick={() => scrollTo("catalog")}>
              {t("ctaSecondary")}
            </Button>
          </div>

          {socialLinks.length > 0 ? (
            <div className="hero-stagger-item mt-5 rounded-xl border border-accent-2/30 bg-gradient-to-br from-accent/[0.07] via-surface to-accent-2/[0.1] p-3.5 shadow-[0_6px_24px_rgba(14,58,91,0.06)] ring-1 ring-accent/10 sm:p-4">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="font-display text-sm font-semibold text-ink sm:text-base">
                    {tFooter("socialLabel")}
                  </p>
                  <p className="mt-0.5 max-w-md font-sans text-xs leading-snug text-ink-muted sm:text-sm">
                    {t("socialHint")}
                  </p>
                </div>
                <span className="hidden rounded-full border border-accent-2/25 bg-surface/80 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent sm:inline">
                  {t("socialBadge")}
                </span>
              </div>
              <SocialLinks
                className="mt-2.5 gap-2.5 sm:gap-3"
                links={socialLinks}
                size="md"
                showLabels
                iconClassName="border-accent/15 bg-surface text-accent shadow-sm hover:border-accent-2 hover:bg-accent hover:text-white"
              />
            </div>
          ) : null}

          <div
            ref={statsRef}
            className={cn(
              "hero-stagger-item mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3",
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

        <div className="relative flex items-center justify-center py-12 lg:col-span-6 lg:py-24 lg:pl-6 xl:pl-10">
          <Reveal visible={isVisible} direction="right" className="relative w-full max-w-2xl lg:max-w-none">
            <div className="hero-image-float">
              <Card className="relative overflow-hidden border-border bg-surface p-2 shadow-[0_24px_60px_rgba(11,31,42,0.12)] ring-1 ring-accent-2/15 transition-shadow duration-500 hover:shadow-[0_28px_70px_rgba(11,31,42,0.16)]">
                <div className="relative aspect-[5/4] overflow-hidden rounded-lg">
                  <ExportImage
                    src={heroSrc}
                    alt={t("imageAlt")}
                    overlay="none"
                    objectPosition="center center"
                    priority
                    staticFrame
                    className="absolute inset-0 h-full w-full"
                    sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 640px"
                  />
                </div>
              </Card>
            </div>

            <div className="hero-float-badge absolute -bottom-3 -left-3 max-w-[200px] rounded-lg border border-border bg-surface/95 px-4 py-3 shadow-lg backdrop-blur-md md:-left-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-sea">
                {t("imageCaptionLabel")}
              </p>
              <p className="mt-1 font-display text-sm leading-snug text-ink">
                {t("imageCaption")}
              </p>
            </div>

            <div className="hero-float-badge-delayed absolute -right-2 top-8 hidden rounded-lg border border-accent-2/30 bg-accent px-3 py-2 shadow-md md:block">
              <p className="font-mono text-[10px] uppercase tracking-wider text-bg/70">
                {t("capacityBadge")}
              </p>
              <p className="font-display text-lg font-semibold text-bg">500 MT/yr</p>
            </div>
          </Reveal>
        </div>
      </div>

      <HeroMarquee />
    </section>
  );
}
