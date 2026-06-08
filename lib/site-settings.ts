import { EXPORT_IMAGES, resolveExportImageSrc } from "@/data/export-images";
import { OSI_SOCIAL_BUNDLED } from "@/data/social-defaults";
import {
  defaultMetaPixelSettings,
  mergeMetaPixelSettings,
  type MetaPixelSettings,
} from "@/lib/meta-pixel";

export const SOCIAL_PLATFORM_OPTIONS = [
  "whatsapp",
  "wechat",
  "line",
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "linkedin",
  "x",
  "custom",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORM_OPTIONS)[number];

export const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  whatsapp: "WhatsApp",
  wechat: "WeChat",
  line: "LINE",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  custom: "Custom link",
};

export type SocialLinkEntry = {
  id: string;
  platform: SocialPlatform;
  label: string;
  handle: string;
  url: string;
};

export type SiteSettings = {
  socialLinks: SocialLinkEntry[];
  images: {
    hero: string;
    trustBar: string;
    exportHero: string;
    processBanner: string;
  };
  metaPixel: MetaPixelSettings;
};

export const SITE_SETTINGS_DOC = "global";

const ENV_BY_PLATFORM: Partial<Record<SocialPlatform, string>> = {
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
    process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP,
  wechat: process.env.NEXT_PUBLIC_SOCIAL_WECHAT,
  line: process.env.NEXT_PUBLIC_SOCIAL_LINE,
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
  tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK,
};

function entry(
  platform: SocialPlatform,
  url = "",
  handle = "",
  label?: string
): SocialLinkEntry {
  return {
    id: platform,
    platform,
    label: label ?? PLATFORM_LABELS[platform],
    handle,
    url: url.trim(),
  };
}

export function defaultSocialLinks(): SocialLinkEntry[] {
  return (
    [
      "whatsapp",
      "wechat",
      "line",
      "facebook",
      "instagram",
      "tiktok",
    ] as SocialPlatform[]
  ).map((platform) =>
    entry(platform, ENV_BY_PLATFORM[platform]?.trim() ?? "")
  );
}

export function createSocialLink(
  platform: SocialPlatform = "custom"
): SocialLinkEntry {
  return {
    id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    platform,
    label: platform === "custom" ? "New link" : PLATFORM_LABELS[platform],
    handle: "",
    url: "",
  };
}

function normalizeEntry(raw: unknown): SocialLinkEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Partial<SocialLinkEntry>;
  const platform = SOCIAL_PLATFORM_OPTIONS.includes(
    row.platform as SocialPlatform
  )
    ? (row.platform as SocialPlatform)
    : "custom";
  const url = String(row.url ?? "").trim();
  const handle = String(row.handle ?? "").trim();
  const label = String(row.label ?? "").trim() || PLATFORM_LABELS[platform];
  const id = String(row.id ?? "").trim() || createSocialLink(platform).id;
  return { id, platform, label, handle, url };
}

function legacySocialToLinks(
  social: Record<string, Partial<{ handle?: string; url?: string }>>
): SocialLinkEntry[] {
  return (
    [
      "whatsapp",
      "wechat",
      "line",
      "facebook",
      "instagram",
      "tiktok",
    ] as SocialPlatform[]
  )
    .map((platform) => {
      const row = social[platform];
      if (!row) return null;
      return entry(
        platform,
        String(row.url ?? ""),
        String(row.handle ?? "")
      );
    })
    .filter((row): row is SocialLinkEntry => row !== null);
}

function parseSocialLinks(stored: unknown): SocialLinkEntry[] | null {
  if (Array.isArray(stored)) {
    const links = stored
      .map(normalizeEntry)
      .filter((row): row is SocialLinkEntry => row !== null);
    return links;
  }
  if (stored && typeof stored === "object") {
    return legacySocialToLinks(
      stored as Record<string, Partial<{ handle?: string; url?: string }>>
    );
  }
  return null;
}

function pickImages(data: unknown): Partial<SiteSettings["images"]> {
  if (!data || typeof data !== "object") return {};
  const raw = data as { images?: Partial<SiteSettings["images"]> };
  return raw.images ?? {};
}

export function mergeSiteSettings(
  stored: Partial<SiteSettings> & { social?: unknown } | null | undefined
): SiteSettings {
  const defaults = defaultSiteSettings();
  if (!stored) return defaults;

  const parsed =
    parseSocialLinks(stored.socialLinks) ??
    (stored.social ? legacySocialToLinks(stored.social as Record<string, Partial<{ handle?: string; url?: string }>>) : null);

  const socialLinks = hydrateSocialLinks(
    parsed && parsed.length > 0
      ? parsed
          .map((l) => normalizeEntry(l))
          .filter((row): row is SocialLinkEntry => row !== null)
      : defaults.socialLinks
  );

  const images = { ...defaults.images };
  const rawImages = pickImages(stored);
  for (const key of Object.keys(images) as Array<keyof SiteSettings["images"]>) {
    const value = rawImages[key];
    if (typeof value === "string" && value.trim()) {
      images[key] = value.trim();
    }
  }

  images.hero = resolveExportImageSrc(images.hero, "heroPort");
  images.trustBar = resolveExportImageSrc(images.trustBar, "heroPort");
  images.exportHero = resolveExportImageSrc(images.exportHero, "heroPort");
  images.processBanner = resolveExportImageSrc(images.processBanner, "heroPort");

  return {
    socialLinks,
    images,
    metaPixel: mergeMetaPixelSettings(stored.metaPixel),
  };
}

export function defaultSiteSettings(): SiteSettings {
  return {
    socialLinks: defaultSocialLinks(),
    images: {
      hero: EXPORT_IMAGES.heroPort,
      trustBar: EXPORT_IMAGES.heroPort,
      exportHero: EXPORT_IMAGES.heroPort,
      processBanner: EXPORT_IMAGES.heroPort,
    },
    metaPixel: defaultMetaPixelSettings(),
  };
}

function hasWhatsAppTarget(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  return trimmed.replace(/\D/g, "").length >= 8;
}

function hasResolvableSocialUrl(link: SocialLinkEntry): boolean {
  if (link.platform === "whatsapp") {
    return (
      hasWhatsAppTarget(link.url) || hasWhatsAppTarget(link.handle)
    );
  }
  const url = link.url.trim();
  return url.length > 0 && url !== "#";
}

function hydrateSocialLinks(links: SocialLinkEntry[]): SocialLinkEntry[] {
  const envByPlatform = new Map(
    defaultSocialLinks().map((link) => [link.platform, link])
  );

  return links.map((link) => {
    if (hasResolvableSocialUrl(link)) return link;

    const env = envByPlatform.get(link.platform);
    if (env && hasResolvableSocialUrl(env)) {
      return {
        ...link,
        url: env.url.trim() || link.url,
        handle: link.handle.trim() || env.handle,
      };
    }

    const bundled = OSI_SOCIAL_BUNDLED[link.platform];
    if (bundled?.url.trim()) {
      return {
        ...link,
        url: bundled.url.trim(),
        handle: link.handle.trim() || bundled.handle,
      };
    }

    if (link.platform === "whatsapp" && link.handle.trim()) {
      return link;
    }

    return link;
  });
}

export function activeSocialLinks(settings: SiteSettings): SocialLinkEntry[] {
  const hydrated = hydrateSocialLinks(settings.socialLinks);
  const active = hydrated.filter((link) => hasResolvableSocialUrl(link));

  if (active.length > 0) return active;

  return defaultSocialLinks().filter((link) => hasResolvableSocialUrl(link));
}

export function imageOrDefault(
  value: string | undefined,
  fallback: string
): string {
  return value?.trim() ? value.trim() : fallback;
}
