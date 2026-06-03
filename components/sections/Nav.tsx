"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Menu } from "lucide-react";
import { OsiLogo } from "@/components/brand/OsiLogo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSelect } from "@/components/nav/LanguageSelect";
import { useActiveSection } from "@/lib/use-section-observer";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  { id: "about", key: "about" },
  { id: "catalog", key: "catalog" },
  { id: "process", key: "process" },
  { id: "compliance", key: "compliance" },
  { id: "faq", key: "faq" },
  { id: "rfq", key: "rfq" },
] as const;

export default function Nav() {
  const t = useTranslations("nav");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(NAV_SECTIONS.map((s) => s.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setSheetOpen(false);
  };

  const linkClass = (id: string, mobile?: boolean) => {
    const isActive = activeSection === id;
    return cn(
      "relative rounded-full font-sans font-medium transition-[color,background-color,box-shadow] duration-200",
      mobile ? "w-full px-4 py-3 text-left text-base" : "px-3.5 py-2 text-[13px]",
      isActive
        ? "bg-accent text-bg shadow-sm hover:bg-ink hover:shadow-md"
        : cn(
            "text-ink-muted",
            "hover:bg-accent/[0.08] hover:text-accent",
            "focus-visible:bg-accent/[0.08] focus-visible:text-accent focus-visible:outline-none"
          )
    );
  };

  const NavLinks = ({ mobile }: { mobile?: boolean }) => (
    <>
      {NAV_SECTIONS.map(({ id, key }) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollTo(id)}
          className={linkClass(id, mobile)}
        >
          {t(key)}
        </button>
      ))}
    </>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border/80 bg-surface/95 shadow-[0_4px_24px_rgba(11,31,42,0.06)] backdrop-blur-md"
          : "border-transparent bg-surface/80 backdrop-blur-sm"
      )}
    >
      <div className="page-container flex h-[76px] items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="group -ml-1 flex min-w-0 shrink-0 items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors duration-200 hover:bg-accent/[0.06]"
        >
          <OsiLogo size={44} priority />
          <div className="hidden flex-col sm:flex">
            <span className="font-display text-[17px] font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
              {t("wordmark")}
            </span>
            <span className="font-sans text-xs font-normal text-ink-muted transition-colors duration-200 group-hover:text-sea">
              {t("tagline")}
            </span>
          </div>
        </button>

        <nav
          className="hidden items-center gap-1 xl:flex"
          aria-label="Main"
        >
          <NavLinks />
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSelect />
          <Button
            variant="nav"
            size="nav"
            onClick={() => scrollTo("rfq")}
            className="group"
          >
            {t("requestQuote")}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg text-accent transition-colors duration-200 hover:border-accent/30 hover:bg-tag-bg lg:hidden"
              aria-label={t("menuOpen")}
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <OsiLogo size={36} />
                <SheetTitle className="font-display text-lg">
                  {t("wordmark")}
                </SheetTitle>
              </div>
              <p className="font-sans text-sm text-ink-muted">{t("tagline")}</p>
            </SheetHeader>
            <nav
              className="mt-6 flex flex-1 flex-col gap-2 overflow-y-auto"
              aria-label="Mobile"
            >
              <NavLinks mobile />
            </nav>
            <div className="mt-auto space-y-4 border-t border-border pt-6">
              <LanguageSelect
                triggerClassName="w-full min-w-0"
                onLocaleChange={() => setSheetOpen(false)}
              />
              <Button
                variant="nav"
                className="w-full"
                onClick={() => scrollTo("rfq")}
              >
                {t("requestQuote")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
