"use client";

import { useTranslations } from "next-intl";
import { FileCheck, Factory, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSectionObserver, useCountUp } from "@/lib/use-section-observer";
import { useStaggerVisible } from "@/lib/use-stagger-visible";
import { cn } from "@/lib/utils";

const STATS = [
  { value: 8, suffix: "+", labelKey: "statYears" as const },
  { value: 14, suffix: "", labelKey: "statCountries" as const },
  { value: 500, suffix: "MT", labelKey: "statCapacity" as const, isText: true },
  { value: 3, suffix: "", labelKey: "statCategories" as const },
];

const CAPABILITIES = [
  { key: "sourcing" as const, icon: Network },
  { key: "processing" as const, icon: Factory },
  { key: "docs" as const, icon: FileCheck },
];

function StatCard({
  value,
  suffix,
  label,
  isActive,
  isText,
}: {
  value: number;
  suffix: string;
  label: string;
  isActive: boolean;
  isText?: boolean;
}) {
  const count = useCountUp(value, isActive);
  const display = `${count}${suffix}`;

  return (
    <Card className="card-interactive stat-card relative overflow-hidden border-border bg-surface">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-2/35 to-transparent"
        aria-hidden
      />
      <CardContent className="p-4 sm:p-5">
        <span className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-none tabular-nums text-accent">
          {display}
        </span>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2/70" aria-hidden />
          <span className="font-sans text-xs font-medium leading-snug text-ink-muted sm:text-[13px]">
            {label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function About() {
  const t = useTranslations("about");
  const { ref, isVisible } = useSectionObserver();
  const { ref: capRef, isVisible: capVisible } = useStaggerVisible();

  return (
    <section
      ref={ref}
      id="about"
      className={cn(
        "section-animate section-divider",
        isVisible && "is-visible"
      )}
    >
      <div className="page-container py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="section-label">{t("label")}</p>
            <h2 className="mt-4 whitespace-pre-line font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-ink">
              {t("title")}
            </h2>
            <div className="mt-8 space-y-5 font-sans text-base leading-relaxed text-ink-muted">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 auto-rows-min items-start gap-x-3 gap-y-2 sm:gap-y-2.5 lg:col-span-7">
            {STATS.map((stat) => (
              <StatCard
                key={stat.labelKey}
                value={stat.value}
                suffix={stat.suffix}
                label={t(stat.labelKey)}
                isActive={isVisible}
                isText={stat.isText}
              />
            ))}
          </div>
        </div>

        <Separator className="my-12" />

        <p className="section-label">{t("capabilitiesTitle")}</p>
        <div
          ref={capRef}
          className={cn(
            "mt-6 grid grid-cols-1 gap-4 md:grid-cols-3",
            capVisible && "stagger-visible"
          )}
        >
          {CAPABILITIES.map(({ key, icon: Icon }) => (
            <Card
              key={key}
              className="stagger-item card-interactive group relative overflow-hidden border-border bg-surface"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sea/25 to-transparent"
                aria-hidden
              />
              <CardHeader className="pb-2">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-tag-bg transition-colors duration-200 group-hover:border-sea/50 group-hover:bg-accent/[0.06]">
                  <Icon className="h-5 w-5 text-accent-2" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-base">{t(`capabilities.${key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-sans text-sm leading-relaxed text-ink-muted">
                  {t(`capabilities.${key}.text`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
