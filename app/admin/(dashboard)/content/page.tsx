import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { getSiteContent } from "@/lib/admin-actions";
import type { LocaleCode, SiteContent } from "@/lib/admin-types";
import { isAdminConfigured } from "@/lib/firebase-admin";
import en from "@/messages/en.json";
import ja from "@/messages/ja.json";
import zh from "@/messages/zh.json";

const LOCALES: LocaleCode[] = ["en", "ja", "zh"];

function defaultsFromMessages(messages: typeof en): SiteContent {
  return {
    hero: {
      headline1: messages.hero.headline1,
      headline2: messages.hero.headline2,
      headline3: messages.hero.headline3,
      body: messages.hero.body,
      trustLine: messages.hero.trustLine,
    },
    about: {
      title: messages.about.title,
      p1: messages.about.p1,
      p2: messages.about.p2,
      p3: messages.about.p3,
    },
    trust: {
      title: messages.trust.title,
      subtitle: messages.trust.subtitle,
    },
  };
}

function mergeContent(
  defaults: SiteContent,
  stored: SiteContent
): SiteContent {
  return {
    hero: { ...defaults.hero, ...pickNonEmpty(stored.hero) },
    about: { ...defaults.about, ...pickNonEmpty(stored.about) },
    trust: { ...defaults.trust, ...pickNonEmpty(stored.trust) },
  };
}

function pickNonEmpty<T extends Record<string, string>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v.trim().length > 0)
  ) as Partial<T>;
}

export default async function AdminContentPage() {
  const firebaseReady = isAdminConfigured();

  const messageDefaults = {
    en: defaultsFromMessages(en),
    ja: defaultsFromMessages(ja),
    zh: defaultsFromMessages(zh),
  };

  if (!firebaseReady) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Site Content"
          title="Homepage copy"
          description="Connect Firestore to override hero, about, and trust bar text per locale on the live site."
        />
        <ContentEditor initialByLocale={messageDefaults} readOnly />
      </div>
    );
  }

  const initialByLocale = { ...messageDefaults };

  for (const locale of LOCALES) {
    try {
      const stored = await getSiteContent(locale);
      initialByLocale[locale] = mergeContent(messageDefaults[locale], stored);
    } catch {
      initialByLocale[locale] = messageDefaults[locale];
    }
  }

  const storedLocales = LOCALES.filter((locale) => {
    const stored = initialByLocale[locale];
    const defaults = messageDefaults[locale];
    return JSON.stringify(stored) !== JSON.stringify(defaults);
  }).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Site Content"
        title="Homepage copy"
        description="Edit hero, about, and trust bar per locale. Empty fields fall back to bundled translation files."
      >
        <Button variant="outline" size="sm" asChild>
          <Link href="/en">Preview EN homepage</Link>
        </Button>
      </AdminPageHeader>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Locales" value={3} hint="EN · JA · ZH" />
        <StatCard label="Customized in Firestore" value={storedLocales} />
        <StatCard label="Using file defaults" value={3 - storedLocales} />
      </div>

      <ContentEditor initialByLocale={initialByLocale} />
    </div>
  );
}
