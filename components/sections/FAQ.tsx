"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useSectionObserver } from "@/lib/use-section-observer";
import { cn } from "@/lib/utils";

const FAQ_KEYS = ["moq", "grades", "shipping", "samples", "payment", "traceability"] as const;

export default function FAQ() {
  const t = useTranslations("faq");
  const { ref, isVisible } = useSectionObserver();

  return (
    <section
      ref={ref}
      id="faq"
      className={cn(
        "section-animate section-divider bg-surface",
        isVisible && "is-visible"
      )}
    >
      <div className="page-container grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-4">
          <p className="section-label">{t("label")}</p>
          <h2 className="mt-4 whitespace-pre-line font-display text-[clamp(2rem,4vw,2.5rem)] leading-tight text-ink">
            {t("title")}
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-ink-muted">
            {t("subtitle")}
          </p>
          <Card className="mt-8 card-interactive">
            <CardContent className="p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-sea">
                {t("supportLabel")}
              </p>
              <p className="mt-2 font-sans text-sm text-ink-muted">
                {t("supportText")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Accordion
            type="single"
            collapsible
            className="w-full overflow-hidden rounded-lg border border-border bg-bg px-4"
          >
            {FAQ_KEYS.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger>{t(`items.${key}.q`)}</AccordionTrigger>
                <AccordionContent>{t(`items.${key}.a`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
