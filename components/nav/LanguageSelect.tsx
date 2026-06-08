"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { LocaleFlag } from "@/components/nav/LocaleFlag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const LOCALES = ["en", "ja", "zh"] as const;

type LanguageSelectProps = {
  className?: string;
  triggerClassName?: string;
  onLocaleChange?: () => void;
  compact?: boolean;
};

export function LanguageSelect({
  className,
  triggerClassName,
  onLocaleChange,
  compact = false,
}: LanguageSelectProps) {
  const t = useTranslations("nav.languages");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const localeHref = (loc: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const rest = segments.slice(1).join("/");
    return `/${loc}${rest ? `/${rest}` : ""}`;
  };

  const onValueChange = (value: string) => {
    onLocaleChange?.();
    router.push(localeHref(value));
  };

  const flagSize = compact ? "md" : "lg";

  return (
    <Select value={locale} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "min-w-[4.75rem] gap-1.5 px-2.5 normal-case [&>span]:line-clamp-none [&>span]:overflow-visible",
          compact ? "h-11" : "h-10",
          triggerClassName
        )}
        aria-label={`${t("label")}: ${t(locale as "en" | "ja" | "zh")}`}
      >
        <LocaleFlag locale={locale} size={flagSize} />
        <SelectValue className="sr-only">{t(locale as "en" | "ja" | "zh")}</SelectValue>
      </SelectTrigger>
      <SelectContent className={cn("min-w-[5.5rem]", className)}>
        {LOCALES.map((loc) => (
          <SelectItem
            key={loc}
            value={loc}
            className="justify-center py-3 pl-3 pr-8 uppercase tracking-normal"
            aria-label={t(loc)}
          >
            <LocaleFlag locale={loc} size="lg" label={t(loc)} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { LOCALES };
