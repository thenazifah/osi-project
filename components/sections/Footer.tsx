"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { OsiLogo } from "@/components/brand/OsiLogo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const LINKS = [
  { id: "about", key: "about" },
  { id: "catalog", key: "catalog" },
  { id: "process", key: "process" },
  { id: "compliance", key: "compliance" },
  { id: "faq", key: "faq" },
  { id: "rfq", key: "rfq" },
] as const;

const LOCALES = ["en", "ja", "zh"] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tLang = useTranslations("nav.languages");
  const locale = useLocale();
  const pathname = usePathname();

  const localeHref = (loc: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const rest = segments.slice(1).join("/");
    return `/${loc}${rest ? `/${rest}` : ""}`;
  };

  const scrollTo = (id: string, hash?: string) => {
    if (hash) {
      window.location.hash = hash;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="mt-auto">
      <div className="bg-gradient-to-br from-accent via-accent to-ink text-bg">
        <div className="page-container flex flex-col items-start justify-between gap-8 py-14 md:flex-row md:items-center">
          <div className="max-w-lg">
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-bg/60">
              OSI Export
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold leading-tight md:text-3xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-bg/75">
              {t("ctaSubtitle")}
            </p>
          </div>
          <Button
            variant="footer"
            size="lg"
            onClick={() => scrollTo("rfq")}
            className="group shrink-0"
          >
            {t("ctaButton")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>

      <div className="border-t border-border bg-surface">
        <div className="page-container grid grid-cols-1 gap-12 py-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <OsiLogo size={56} />
            <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-ink-muted">
              {t("mission")}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {LOCALES.map((loc) => (
                <Link
                  key={loc}
                  href={localeHref(loc)}
                    className={cn(
                    "rounded-full px-3.5 py-1.5 font-sans text-xs font-medium uppercase tracking-wide transition-all duration-200",
                    locale === loc
                      ? "bg-accent text-bg"
                      : "bg-tag-bg text-ink-muted hover:text-accent"
                  )}
                >
                  {tLang(loc)}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-accent">
              {t("quickLinks")}
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {LINKS.map(({ id, key }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(id)}
                    className="font-sans text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-accent-2"
                  >
                    {tNav(key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-accent">
              {t("contactLabel")}
            </p>
            <div className="mt-5 space-y-4 rounded-xl border border-border bg-bg p-5">
              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-2"
                  strokeWidth={1.75}
                />
                <address className="not-italic font-sans text-sm leading-relaxed text-ink-muted">
                  {t("address")}
                </address>
              </div>
              <Separator />
              <a
                href="mailto:procurement@organicscales.com"
                className="flex items-center gap-3 font-sans text-sm font-medium text-accent transition-colors hover:text-accent-2"
              >
                <Mail className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                procurement@organicscales.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-bg">
          <div className="page-container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <p className="font-sans text-xs text-ink-muted">{t("copyright")}</p>
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => scrollTo("policy", "policy-privacy")}
                className="font-sans text-xs font-medium text-ink-muted transition-colors hover:text-accent"
              >
                {t("privacy")}
              </button>
              <button
                type="button"
                onClick={() => scrollTo("policy", "policy-terms")}
                className="font-sans text-xs font-medium text-ink-muted transition-colors hover:text-accent"
              >
                {t("terms")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
