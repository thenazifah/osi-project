"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, ImageIcon, Link2, Plus, Trash2 } from "lucide-react";
import {
  saveSiteSettings,
  seedSiteSettingsFromDefaults,
} from "@/lib/admin-actions";
import type { SiteSettings } from "@/lib/admin-types";
import {
  createSocialLink,
  PLATFORM_LABELS,
  SOCIAL_PLATFORM_OPTIONS,
  type SocialLinkEntry,
  type SocialPlatform,
} from "@/lib/site-settings";
import { normalizePixelId } from "@/lib/meta-pixel";
import { SiteImageField } from "@/components/admin/SiteImageField";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const IMAGE_FIELDS: {
  key: keyof SiteSettings["images"];
  label: string;
  hint: string;
}[] = [
  {
    key: "hero",
    label: "Hero image",
    hint: "Homepage hero background",
  },
  {
    key: "trustBar",
    label: "Trust bar image",
    hint: "Trust bar section image",
  },
  {
    key: "exportHero",
    label: "Export logistics image",
    hint: "Sea freight / export block",
  },
  {
    key: "processBanner",
    label: "Process banner",
    hint: "Processing workflow header image",
  },
];

export function SiteSettingsEditor({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateSocialLink = (
    id: string,
    patch: Partial<SocialLinkEntry>
  ) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link) =>
        link.id === id ? { ...link, ...patch } : link
      ),
    }));
  };

  const changePlatform = (id: string, platform: SocialPlatform) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link) =>
        link.id === id
          ? {
              ...link,
              platform,
              label:
                link.platform === "custom" || platform !== "custom"
                  ? PLATFORM_LABELS[platform]
                  : link.label,
            }
          : link
      ),
    }));
  };

  const addSocialLink = () => {
    setSettings((prev) => {
      const hasWhatsapp = prev.socialLinks.some(
        (link) => link.platform === "whatsapp"
      );
      return {
        ...prev,
        socialLinks: [
          ...prev.socialLinks,
          createSocialLink(hasWhatsapp ? "instagram" : "whatsapp"),
        ],
      };
    });
  };

  const removeSocialLink = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((link) => link.id !== id),
    }));
  };

  const updateImage = (key: keyof SiteSettings["images"], value: string) => {
    setSettings((prev) => ({
      ...prev,
      images: { ...prev.images, [key]: value },
    }));
  };

  const updateMetaPixel = (patch: Partial<SiteSettings["metaPixel"]>) => {
    setSettings((prev) => ({
      ...prev,
      metaPixel: { ...prev.metaPixel, ...patch },
    }));
  };

  const pixelIdValid = normalizePixelId(settings.metaPixel.pixelId) !== null;
  const pixelActive = settings.metaPixel.enabled && pixelIdValid;

  const save = () => {
    setMessage(null);
    startTransition(async () => {
      await saveSiteSettings(settings);
      setMessage("Site settings saved. Landing page, header, footer, and hero updated.");
      router.refresh();
    });
  };

  const seed = () => {
    startTransition(async () => {
      await seedSiteSettingsFromDefaults();
      setMessage("Reset to bundled defaults. Reloading…");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : "Save site settings"}
        </Button>
        <Button type="button" variant="outline" onClick={seed} disabled={isPending}>
          Reset to defaults
        </Button>
      </div>

      {message ? (
        <p className="rounded-lg border border-border bg-tag-bg px-4 py-3 font-sans text-sm text-ink">
          {message}
        </p>
      ) : null}

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-sea" />
            Meta Pixel
          </CardTitle>
          <p className="font-sans text-xs text-ink-muted">
            Facebook / Instagram ad tracking. Find your Pixel ID in{" "}
            <a
              href="https://business.facebook.com/events_manager"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              Meta Events Manager
            </a>
            .
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Checkbox
              id="meta-pixel-enabled"
              checked={settings.metaPixel.enabled}
              onCheckedChange={(checked) =>
                updateMetaPixel({ enabled: checked === true })
              }
            />
            <div className="space-y-1">
              <Label htmlFor="meta-pixel-enabled" className="cursor-pointer">
                Enable Meta Pixel on public site
              </Label>
              <p className="font-sans text-xs text-ink-muted">
                Tracks PageView, RFQ submissions (Lead), and WhatsApp clicks
                (Contact).
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-pixel-id">Pixel ID</Label>
            <Input
              id="meta-pixel-id"
              value={settings.metaPixel.pixelId}
              onChange={(e) => updateMetaPixel({ pixelId: e.target.value })}
              placeholder="123456789012345"
              inputMode="numeric"
            />
            <p className="font-sans text-xs text-ink-muted">
              Numeric ID only (8–20 digits). You can also set{" "}
              <code className="rounded bg-tag-bg px-1">NEXT_PUBLIC_META_PIXEL_ID</code>{" "}
              in environment variables.
            </p>
          </div>

          <p
            className={`rounded-lg px-4 py-3 font-sans text-sm ${
              pixelActive
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-border bg-tag-bg text-ink-muted"
            }`}
          >
            {pixelActive
              ? "Meta Pixel is active on the public website."
              : settings.metaPixel.enabled && !pixelIdValid
                ? "Enter a valid Pixel ID to start tracking."
                : "Meta Pixel is disabled."}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-surface">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="h-4 w-4 text-sea" />
              Social links
            </CardTitle>
            <p className="mt-1 font-sans text-xs text-ink-muted">
              Add or remove links. Rows with a profile URL or handle appear on the
              live site. For WhatsApp, use a phone number with country code (e.g.{" "}
              <code className="rounded bg-tag-bg px-1">8801712345678</code>), not
              @username.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
            <Plus className="h-4 w-4" />
            Add link
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.socialLinks.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center font-sans text-sm text-ink-muted">
              No social links yet. Click &quot;Add link&quot; to create one.
            </p>
          ) : (
            settings.socialLinks.map((link) => (
              <div
                key={link.id}
                className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2"
              >
                <div className="flex items-center justify-between gap-2 sm:col-span-2">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-sea">
                    {link.label || PLATFORM_LABELS[link.platform]}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeSocialLink(link.id)}
                    aria-label="Remove social link"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={link.platform}
                    onValueChange={(value) =>
                      changePlatform(link.id, value as SocialPlatform)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SOCIAL_PLATFORM_OPTIONS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {PLATFORM_LABELS[platform]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${link.id}-label`}>Display label</Label>
                  <Input
                    id={`${link.id}-label`}
                    value={link.label}
                    onChange={(e) =>
                      updateSocialLink(link.id, { label: e.target.value })
                    }
                    placeholder="Instagram"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${link.id}-handle`}>Handle / ID</Label>
                  <Input
                    id={`${link.id}-handle`}
                    value={link.handle}
                    onChange={(e) =>
                      updateSocialLink(link.id, { handle: e.target.value })
                    }
                    placeholder={
                      link.platform === "whatsapp"
                        ? "8801712345678"
                        : "@organicscales"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${link.id}-url`}>Profile URL</Label>
                  <Input
                    id={`${link.id}-url`}
                    value={link.url}
                    onChange={(e) =>
                      updateSocialLink(link.id, { url: e.target.value })
                    }
                    placeholder={
                      link.platform === "whatsapp"
                        ? "https://wa.me/8801712345678"
                        : "https://"
                    }
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-4 w-4 text-sea" />
            Site images
          </CardTitle>
          <p className="font-sans text-xs text-ink-muted">
            Upload a new image or choose from existing files, then click{" "}
            <strong>Save site settings</strong> to publish on the live website.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {IMAGE_FIELDS.map(({ key, label, hint }) => (
            <SiteImageField
              key={key}
              id={`img-${key}`}
              imageKey={key}
              label={label}
              hint={hint}
              value={settings.images[key]}
              onChange={(value) => updateImage(key, value)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
