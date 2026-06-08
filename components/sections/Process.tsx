"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, Microscope, Globe } from "lucide-react";
import { ExportImage } from "@/components/visuals/ExportImage";
import { EXPORT_IMAGES } from "@/data/export-images";
import { Card, CardContent } from "@/components/ui/card";
import { useSectionObserver } from "@/lib/use-section-observer";
import { useStaggerVisible } from "@/lib/use-stagger-visible";
import { cn } from "@/lib/utils";

const STEP_KEYS = [
  "collection",
  "sorting",
  "cleaning",
  "drying",
  "inspection",
  "packaging",
] as const;

const CALLOUTS = [
  { key: "iso" as const, icon: ShieldCheck },
  { key: "lab" as const, icon: Microscope },
  { key: "export" as const, icon: Globe },
];

export default function Process() {
  const t = useTranslations("process");
  const { ref, isVisible } = useSectionObserver();
  const { ref: calloutRef, isVisible: calloutVisible } = useStaggerVisible();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    if (!isVisible || !timelineRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLineProgress(1);
      },
      { threshold: 0.3 }
    );

    observer.observe(timelineRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  const dashOffset = 1000 * (1 - lineProgress);

  return (
    <section
      ref={ref}
      id="process"
      className={cn(
        "section-animate section-divider",
        isVisible && "is-visible"
      )}
      style={{ animationDelay: "160ms" }}
    >
      <div className="page-container py-16 lg:py-24">
        <div className="mb-12 grid grid-cols-1 items-end gap-8 lg:grid-cols-2">
          <div>
            <p className="section-label text-ink-muted">{t("label")}</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-ink">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-xl font-sans text-base text-ink-muted">
              {t("subtitle")}
            </p>
          </div>
          <ExportImage
            src={EXPORT_IMAGES.shipSea}
            alt={t("imageAlt")}
            overlay="dark"
            objectPosition="center 50%"
            className="aspect-[21/9] w-full rounded-xl lg:aspect-[2/1]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div ref={timelineRef} className="relative">
          <div className="hidden lg:block">
            <svg
              className="pointer-events-none absolute left-0 right-0 top-4 h-1 w-full"
              preserveAspectRatio="none"
              viewBox="0 0 1000 4"
              aria-hidden
            >
              <line
                x1="0"
                y1="2"
                x2="1000"
                y2="2"
                stroke="var(--border)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="2"
                x2="1000"
                y2="2"
                stroke="var(--accent-2)"
                strokeWidth="2"
                strokeDasharray="1000"
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1.5s ease" }}
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-6 lg:gap-4">
            {STEP_KEYS.map((key, index) => (
              <div
                key={key}
                className="relative flex flex-col items-center text-center lg:items-center"
              >
                {index > 0 && (
                  <div
                    className="absolute -top-6 left-1/2 h-6 w-px -translate-x-1/2 bg-border lg:hidden"
                    aria-hidden
                  />
                )}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-bg font-mono text-xs text-ink">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 font-display text-sm text-ink">
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="mt-1 max-w-[200px] font-sans text-[13px] text-ink-muted sm:max-w-[140px] lg:text-center">
                  {t(`steps.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={calloutRef}
          className={cn(
            "mt-16 grid grid-cols-1 gap-4 border-t border-border pt-8 md:grid-cols-3",
            calloutVisible && "stagger-visible"
          )}
        >
          {CALLOUTS.map(({ key, icon: Icon }) => (
            <Card key={key} className="stagger-item card-interactive bg-surface">
              <CardContent className="flex gap-4 p-5">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-2" strokeWidth={1.5} />
                <div>
                  <p className="font-display text-sm text-ink">
                    {t(`callouts.${key}.label`)}
                  </p>
                  <p className="mt-1 font-sans text-sm text-ink-muted">
                    {t(`callouts.${key}.text`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
