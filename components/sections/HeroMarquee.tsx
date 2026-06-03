"use client";

import { useTranslations } from "next-intl";

const MARQUEE_KEYS = [
  "tilapia",
  "carp",
  "marine",
  "moq",
  "export",
  "origin",
  "pharma",
] as const;

function MarqueePills({ items }: { items: string[] }) {
  const doubled = [...items, ...items];

  return (
    <>
      {doubled.map((label, index) => (
        <span
          key={`${label}-${index}`}
          className="marquee-pill"
          aria-hidden={index >= items.length}
        >
          {label}
        </span>
      ))}
    </>
  );
}

export default function HeroMarquee() {
  const t = useTranslations("hero");
  const items = MARQUEE_KEYS.map((key) => t(`marqueeItems.${key}`));

  return (
    <div className="marquee-band relative border-t border-white/10">
      <div className="marquee-fade-left" aria-hidden />
      <div className="marquee-fade-right" aria-hidden />

      <div className="page-container relative z-[1] flex items-center gap-4 py-4 md:gap-6 md:py-5">
        <span className="marquee-static-label hidden shrink-0 font-sans text-[11px] font-semibold uppercase tracking-widest text-bg/50 md:inline">
          {t("marqueeLabel")}
        </span>
        <div className="marquee-viewport min-w-0 flex-1">
          <div
            className="marquee-track items-center gap-3 md:gap-4"
            aria-label={items.join(", ")}
          >
            <MarqueePills items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}
