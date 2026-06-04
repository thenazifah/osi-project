"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSiteContent, seedSiteContentFromMessages } from "@/lib/admin-actions";
import type { LocaleCode, SiteContent } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOCALES: { code: LocaleCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
];

export function ContentEditor({
  initialByLocale,
  readOnly = false,
}: {
  initialByLocale: Record<LocaleCode, SiteContent>;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [savedByLocale, setSavedByLocale] = useState(initialByLocale);
  const [content, setContent] = useState<SiteContent>(initialByLocale.en);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const switchLocale = (next: LocaleCode) => {
    setLocale(next);
    setContent(savedByLocale[next]);
    setMessage(null);
  };

  const updateHero = (field: keyof SiteContent["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const updateAbout = (field: keyof SiteContent["about"], value: string) => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, [field]: value },
    }));
  };

  const updateTrust = (field: keyof SiteContent["trust"], value: string) => {
    setContent((prev) => ({
      ...prev,
      trust: { ...prev.trust, [field]: value },
    }));
  };

  const save = () => {
    if (readOnly) return;
    setMessage(null);
    startTransition(async () => {
      await saveSiteContent(locale, content);
      setSavedByLocale((prev) => ({ ...prev, [locale]: content }));
      setMessage(`Saved ${locale.toUpperCase()} content.`);
      router.refresh();
    });
  };

  const seedContent = () => {
    if (readOnly) return;
    startTransition(async () => {
      const { count } = await seedSiteContentFromMessages();
      setMessage(`Seeded ${count} locales from translation files.`);
      router.refresh();
    });
  };

  return (
    <fieldset disabled={readOnly} className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Label className="shrink-0">Locale</Label>
        <Select value={locale} onValueChange={(v) => switchLocale(v as LocaleCode)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LOCALES.map(({ code, label }) => (
              <SelectItem key={code} value={code}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" onClick={save} disabled={isPending || readOnly}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={seedContent}
          disabled={isPending || readOnly}
        >
          Seed from messages
        </Button>
      </div>

      {readOnly ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900">
          Preview only — connect Firestore to save changes to the live site.
        </p>
      ) : null}

      {message ? (
        <p className="rounded-lg border border-border bg-tag-bg px-4 py-3 font-sans text-sm text-ink">
          {message}
        </p>
      ) : null}

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-base">Hero section</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Headline line 1</Label>
            <Input
              value={content.hero.headline1}
              onChange={(e) => updateHero("headline1", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Headline line 2</Label>
            <Input
              value={content.hero.headline2}
              onChange={(e) => updateHero("headline2", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Headline line 3</Label>
            <Input
              value={content.hero.headline3}
              onChange={(e) => updateHero("headline3", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Body</Label>
            <Textarea
              value={content.hero.body}
              onChange={(e) => updateHero("body", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Trust line</Label>
            <Input
              value={content.hero.trustLine}
              onChange={(e) => updateHero("trustLine", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-base">About section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title (use \n for line breaks)</Label>
            <Textarea
              value={content.about.title}
              onChange={(e) => updateAbout("title", e.target.value)}
              rows={2}
            />
          </div>
          {(["p1", "p2", "p3"] as const).map((key) => (
            <div key={key} className="space-y-2">
              <Label>{key.toUpperCase()}</Label>
              <Textarea
                value={content.about[key]}
                onChange={(e) => updateAbout(key, e.target.value)}
                rows={3}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-base">Trust bar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.trust.title}
              onChange={(e) => updateTrust("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={content.trust.subtitle}
              onChange={(e) => updateTrust("subtitle", e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {!readOnly ? (
        <p className="font-sans text-xs text-ink-muted">
          Saved copy is stored in Firestore <code className="rounded bg-tag-bg px-1">site_content</code>{" "}
          and applied on the public homepage for EN, JA, and ZH.
        </p>
      ) : null}
    </fieldset>
  );
}
