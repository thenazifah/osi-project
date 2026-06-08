"use client";

import { useTranslations } from "next-intl";
import { Anchor, Container, Ship } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExportImage } from "@/components/visuals/ExportImage";
import { EXPORT_IMAGES } from "@/data/export-images";
import { SectionIntro, SectionIntroItem } from "@/components/motion/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { useSectionObserver } from "@/lib/use-section-observer";
import { useStaggerVisible } from "@/lib/use-stagger-visible";
import { cn } from "@/lib/utils";

const CARDS = [
  { key: "cargo" as const, icon: Ship },
  { key: "port" as const, icon: Container },
  { key: "sea" as const, icon: Anchor },
] as const;

export default function ExportLogistics({ exportHeroImage }: { exportHeroImage?: string }) {
  const t = useTranslations("exportLogistics");
  const { ref, isVisible } = useSectionObserver();
  const { ref: gridRef, isVisible: gridVisible } = useStaggerVisible();

  return (
    <section
      ref={ref}
      className={cn(
        "section-animate section-alt border-b border-border",
        isVisible && "is-visible"
      )}
    >
      <div className="page-container py-16 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <SectionIntro visible={isVisible} className="lg:col-span-5">
            <SectionIntroItem>
              <Badge variant="export">{t("badge")}</Badge>
            </SectionIntroItem>
            <SectionIntroItem>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight text-ink">
                {t("title")}
              </h2>
            </SectionIntroItem>
            <SectionIntroItem>
              <p className="mt-5 font-sans text-base leading-relaxed text-ink-muted">
                {t("subtitle")}
              </p>
            </SectionIntroItem>
            <SectionIntroItem>
              <ul className="mt-8 space-y-4">
                {(["fob", "docs", "tracking"] as const).map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-2" />
                    <div>
                      <p className="font-display text-sm text-ink">
                        {t(`highlights.${item}.title`)}
                      </p>
                      <p className="mt-0.5 font-sans text-sm text-ink-muted">
                        {t(`highlights.${item}.text`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionIntroItem>
          </SectionIntro>

          <Reveal visible={isVisible} direction="right" className="relative lg:col-span-7">
            <Card className="overflow-hidden border-border bg-surface p-2 shadow-[0_20px_50px_rgba(11,31,42,0.08)] transition-shadow duration-500 hover:shadow-[0_24px_56px_rgba(11,31,42,0.12)]">
              <ExportImage
                src={exportHeroImage?.trim() || EXPORT_IMAGES.containers}
                alt={t("images.heroAlt")}
                overlay="sea"
                objectPosition="center 40%"
                priority
                className="aspect-[4/3] w-full rounded-lg"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Card>
            <div className="absolute -bottom-4 -left-4 hidden rounded-lg border border-border bg-surface px-4 py-3 shadow-lg md:block">
              <p className="font-mono text-[10px] uppercase tracking-wider text-sea">
                {t("routeLabel")}
              </p>
              <p className="mt-1 font-display text-sm text-ink">
                {t("routeValue")}
              </p>
            </div>
          </Reveal>
        </div>

        <div
          ref={gridRef}
          className={cn(
            "mt-14 grid grid-cols-1 gap-4 md:grid-cols-3",
            gridVisible && "stagger-visible"
          )}
        >
          {CARDS.map(({ key, icon: Icon }) => (
            <Card
              key={key}
              className="stagger-item card-interactive group overflow-hidden border-border bg-surface"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-tag-bg text-accent-2 transition-colors duration-200 group-hover:border-sea/50 group-hover:bg-accent/[0.06]">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm text-ink">
                      {t(`cards.${key}.title`)}
                    </p>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                      {t(`cards.${key}.text`)}
                    </p>
                    <div className="mt-4 h-px w-full bg-border/70" aria-hidden />
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-sea">
                      {t("routeLabel")}
                    </p>
                    <p className="mt-1 font-sans text-xs font-medium text-ink-muted">
                      {t("routeValue")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
