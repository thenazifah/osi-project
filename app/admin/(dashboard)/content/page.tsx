import { ContentEditor } from "@/components/admin/ContentEditor";
import { getSiteContent } from "@/lib/admin-actions";
import type { LocaleCode, SiteContent } from "@/lib/admin-types";
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
  const messageDefaults = {
    en: defaultsFromMessages(en),
    ja: defaultsFromMessages(ja),
    zh: defaultsFromMessages(zh),
  };

  const initialByLocale = { ...messageDefaults };

  for (const locale of LOCALES) {
    try {
      const stored = await getSiteContent(locale);
      initialByLocale[locale] = mergeContent(messageDefaults[locale], stored);
    } catch {
      initialByLocale[locale] = messageDefaults[locale];
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-sea">
          Site Content
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink">Homepage copy</h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          Edit hero, about, and trust bar text per locale. Empty fields fall back to
          bundled translation files.
        </p>
      </div>

      <ContentEditor initialByLocale={initialByLocale} />
    </div>
  );
}
