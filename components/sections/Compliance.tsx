"use client";

import { useTranslations } from "next-intl";
import { Award, ExternalLink } from "lucide-react";
import {
  CertificationMark,
  type CertId,
} from "@/components/certifications/CertificationMark";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSectionObserver } from "@/lib/use-section-observer";
import { useStaggerVisible } from "@/lib/use-stagger-visible";
import { cn } from "@/lib/utils";

const CERT_KEYS: CertId[] = [
  "bsti",
  "iso9001",
  "tradeLicense",
  "exportLicense",
  "irc",
  "environmental",
];

const DOC_URLS: Partial<Record<CertId, string | undefined>> = {
  tradeLicense: process.env.NEXT_PUBLIC_DOC_TRADE_LICENSE,
  exportLicense: process.env.NEXT_PUBLIC_DOC_EXPORT_LICENSE,
  irc: process.env.NEXT_PUBLIC_DOC_IRC,
  environmental: process.env.NEXT_PUBLIC_DOC_ENVIRONMENTAL,
  iso9001: process.env.NEXT_PUBLIC_DOC_QUALITY,
};

export default function Compliance() {
  const t = useTranslations("compliance");
  const { ref, isVisible } = useSectionObserver();
  const { ref: gridRef, isVisible: gridVisible } = useStaggerVisible();

  return (
    <section
      ref={ref}
      id="compliance"
      className={cn(
        "section-animate compliance-dark",
        isVisible && "is-visible"
      )}
      style={{ animationDelay: "200ms" }}
    >
      <div className="page-container py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="section-label mb-6 text-bg/50 before:text-accent-2">
              {t("label")}
            </p>
            <h2 className="whitespace-pre-line font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-bg">
              {t("title")}
            </h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-bg/65">
              {t("subtitle")}
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-bg/30 bg-white/10 px-4 py-2 text-xs text-bg"
          >
            <Award className="mr-2 h-4 w-4 text-accent-2" strokeWidth={1.5} />
            {t("badge")}
          </Badge>
        </div>

        <div
          ref={gridRef}
          className={cn(
            "mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
            gridVisible && "stagger-visible"
          )}
        >
          {CERT_KEYS.map((key) => {
            const docUrl = DOC_URLS[key];
            return (
              <Card
                key={key}
                className="cert-card stagger-item group overflow-hidden"
              >
                <CardContent className="relative z-[1] flex flex-col items-center p-6 text-center">
                  <div className="cert-card-logo flex h-24 w-full items-center justify-center rounded-lg bg-white px-4 py-3">
                    <CertificationMark
                      id={key}
                      className="w-full max-w-[200px]"
                      alt={t(`certifications.${key}.name`)}
                    />
                  </div>
                  <p className="mt-4 font-display text-base font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                    {t(`certifications.${key}.name`)}
                  </p>
                  <p className="mt-1 font-sans text-xs text-ink-muted">
                    {t(`certifications.${key}.issuer`)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <span className="rounded-full bg-tag-bg px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-sea">
                      {t(`certifications.${key}.year`)}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-accent-2">
                      {t(`certifications.${key}.status`)}
                    </span>
                  </div>
                  {docUrl ? (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-medium text-accent transition-colors hover:text-accent-2"
                    >
                      {t("download")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mt-10 max-w-3xl font-sans text-sm leading-relaxed text-bg/55">
          {t("footnote")}
        </p>
      </div>
    </section>
  );
}
