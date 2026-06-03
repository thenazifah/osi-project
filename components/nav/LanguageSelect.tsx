"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
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
};

export function LanguageSelect({
  className,
  triggerClassName,
  onLocaleChange,
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

  return (
    <Select value={locale} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn("min-w-[9.5rem] uppercase", triggerClassName)}
        aria-label={t("label")}
      >
        <SelectValue placeholder={t("label")}>{t(locale as "en" | "ja" | "zh")}</SelectValue>
      </SelectTrigger>
      <SelectContent className={className}>
        {LOCALES.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {t(loc)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { LOCALES };
