"use client";

import { useTranslations } from "next-intl";
import {
  Award,
  FlaskConical,
  Globe2,
  PackageCheck,
  Ship,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExportImage } from "@/components/visuals/ExportImage";
import { EXPORT_IMAGES } from "@/data/export-images";
import { SectionIntro, SectionIntroItem } from "@/components/motion/SectionIntro";
import { Reveal } from "@/components/motion/Reveal";
import { useSectionObserver } from "@/lib/use-section-observer";
import { useStaggerVisible } from "@/lib/use-stagger-visible";
import type { SiteContent } from "@/lib/admin-types";
import { cn } from "@/lib/utils";

const ITEMS = [
  { key: "iso" as const, icon: Award },
  { key: "capacity" as const, icon: PackageCheck },
  { key: "markets" as const, icon: Globe2 },
  { key: "lab" as const, icon: FlaskConical },
  { key: "logistics" as const, icon: Ship },
  { key: "sla" as const, icon: Timer },
];

export default function TrustBar({
  content,
  trustBarImage,
}: {
  content?: SiteContent["trust"];
  trustBarImage?: string;
}) {
  const t = useTranslations("trust");
  const c = (key: keyof SiteContent["trust"]) =>
    content?.[key]?.trim() ? content[key] : t(key);
  const { ref, isVisible } = useSectionObserver();
  const { ref: gridRef, isVisible: gridVisible } = useStaggerVisible();

  return (
    <section
      ref={ref}
      className={cn(
        "section-animate border-b border-border bg-surface py-12 lg:py-14",
        isVisible && "is-visible"
      )}
    >
      <div className="page-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <SectionIntro visible={isVisible} className="lg:col-span-4">
            <SectionIntroItem>
              <Badge variant="export">{t("badge")}</Badge>
            </SectionIntroItem>
            <SectionIntroItem>
              <p className="mt-3 font-display text-xl text-ink lg:text-2xl">{c("title")}</p>
            </SectionIntroItem>
            <SectionIntroItem>
              <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-ink-muted">
                {c("subtitle")}
              </p>
            </SectionIntroItem>
            <SectionIntroItem>
              <Reveal visible={isVisible} direction="scale" className="mt-6 lg:mt-8">
                <ExportImage
                  src={trustBarImage?.trim() || EXPORT_IMAGES.procurementShip}
                  alt={t("imageAlt")}
                  overlay="sea"
                  objectPosition="center 55%"
                  className="aspect-[16/10] w-full rounded-xl"
                  sizes="(max-width: 1024px) 100vw, 360px"
                />
              </Reveal>
            </SectionIntroItem>
          </SectionIntro>

          <div
            ref={gridRef}
            className={cn(
              "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-2",
              gridVisible && "stagger-visible"
            )}
          >
          {ITEMS.map(({ key, icon: Icon }) => (
            <Card
              key={key}
              className={cn("stagger-item card-interactive")}
            >
              <CardContent className="flex gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-tag-bg transition-colors duration-200 group-hover:border-sea">
                  <Icon className="h-5 w-5 text-accent-2" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-display text-sm text-ink">
                    {t(`items.${key}.title`)}
                  </p>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-ink-muted">
                    {t(`items.${key}.text`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
