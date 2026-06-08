"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
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
  { id: "catalog", key: "catalog" },
  { id: "about", key: "about" },
  { id: "process", key: "process" },
  { id: "compliance", key: "compliance" },
  { id: "faq", key: "faq" },
  { id: "rfq", key: "rfq" },
] as const;

export default function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const homePath = `/${locale}`;
  const isHomePage =
    pathname === homePath || pathname === `${homePath}/`;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(
    isHomePage ? NAV_SECTIONS.map((s) => s.id) : []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth" });
    });
  }, [isHomePage, pathname]);

  const goToSection = (id: string) => {
    setSheetOpen(false);
    if (isHomePage) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `${homePath}#${id}`);
      return;
    }
    router.push(`${homePath}#${id}`);
  };

  const linkClass = (id: string, mobile?: boolean) => {
    const isActive = activeSection === id;
    const base = "nav-link relative rounded-full font-sans font-medium transition-[color,background-color,box-shadow] duration-200";
    if (mobile) {
      return cn(
        base,
        "w-full px-4 py-3 text-left text-base",
        isActive
          ? "nav-link-active"
          : "text-ink-muted hover:bg-tag-bg hover:text-accent"
      );
    }
    return cn(base, "px-3.5 py-2 text-[13px]", isActive && "nav-link-active");
  };

  const NavLinks = ({ mobile }: { mobile?: boolean }) => (
    <>
      {NAV_SECTIONS.map(({ id, key }) => (
        <button
          key={id}
          type="button"
          onClick={() => goToSection(id)}
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
        "nav-header sticky top-0 z-50 border-b border-white/10 transition-all duration-300",
        scrolled
          ? "shadow-[0_4px_24px_rgba(11,31,42,0.2)] backdrop-blur-md"
          : "backdrop-blur-sm"
      )}
    >
      <div className="page-container flex h-[76px] items-center justify-between gap-3">
        <Link
          href={isHomePage ? `${homePath}#hero` : homePath}
          onClick={(e) => {
            if (!isHomePage) return;
            e.preventDefault();
            document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
            window.history.replaceState(null, "", `${homePath}#hero`);
          }}
          className="group -ml-1 flex min-w-0 shrink-0 items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors duration-200 hover:bg-sea-light/20 active:bg-export/25"
        >
          <OsiLogo size={44} priority />
          <span className="hidden font-display text-[15px] font-semibold leading-tight tracking-tight text-white transition-colors duration-200 group-hover:text-white/95 lg:block xl:text-[17px]">
            {t("wordmark")}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          <NavLinks />
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSelect triggerClassName="border-white/25 bg-white/10 text-white hover:border-sea-light/50 hover:bg-sea-light/20 active:bg-export/25 [&_svg]:text-white/80" />
          <Button
            variant="nav"
            size="nav"
            onClick={() => goToSection("rfq")}
            className="group"
          >
            {t("requestQuote")}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSelect
            compact
            triggerClassName="h-11 min-w-0 border-white/25 bg-white/10 px-2.5 text-white hover:border-sea-light/50 hover:bg-sea-light/20 active:bg-export/25 [&_svg]:text-white/80"
          />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-200 hover:border-sea-light/50 hover:bg-sea-light/20 active:bg-export/25"
                aria-label={t("menuOpen")}
              >
                <Menu size={20} strokeWidth={1.75} />
              </button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
              <SheetHeader className="border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <OsiLogo size={36} />
                  <SheetTitle className="font-display text-lg">OSI</SheetTitle>
                </div>
              </SheetHeader>
              <nav
                className="mt-6 flex flex-1 flex-col gap-2 overflow-y-auto"
                aria-label="Mobile"
              >
                <NavLinks mobile />
              </nav>
              <div className="mt-auto border-t border-border pt-6">
                <Button
                  variant="primary"
                  size="nav"
                  className="w-full"
                  onClick={() => goToSection("rfq")}
                >
                  {t("requestQuote")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
