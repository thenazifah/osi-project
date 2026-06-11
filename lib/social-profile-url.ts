import type { SocialLinkEntry, SocialPlatform } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

function stripAt(value: string): string {
  return value.trim().replace(/^@+/, "");
}

function normalizeHttpUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.includes(".")) return `https://${trimmed}`;
  return trimmed;
}

const PROFILE_URL_BUILDERS: Partial<
  Record<SocialPlatform, (handle: string) => string>
> = {
  facebook: (handle) => `https://www.facebook.com/${stripAt(handle)}`,
  instagram: (handle) => `https://www.instagram.com/${stripAt(handle)}`,
  tiktok: (handle) => `https://www.tiktok.com/@${stripAt(handle)}`,
  youtube: (handle) => `https://www.youtube.com/@${stripAt(handle)}`,
  linkedin: (handle) => `https://www.linkedin.com/in/${stripAt(handle)}`,
  x: (handle) => `https://x.com/${stripAt(handle)}`,
  line: (handle) => {
    const trimmed = handle.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http")) return trimmed;
    if (trimmed.startsWith("@") || trimmed.startsWith("~")) {
      return `https://line.me/ti/p/${encodeURIComponent(trimmed)}`;
    }
    return `https://line.me/ti/p/~${stripAt(trimmed)}`;
  },
};

/** Resolve a clickable profile URL from stored url and/or handle fields. */
export function resolveSocialProfileUrl(link: SocialLinkEntry): string {
  const url = link.url.trim();
  const handle = link.handle.trim();

  if (link.platform === "whatsapp") {
    return buildWhatsAppUrl(url || handle) ?? "";
  }

  const normalizedUrl = normalizeHttpUrl(url);
  if (normalizedUrl && /^https?:\/\//i.test(normalizedUrl)) {
    return normalizedUrl;
  }

  if (!handle) return "";

  const builder = PROFILE_URL_BUILDERS[link.platform];
  if (builder) return builder(handle);

  if (link.platform === "custom") {
    return normalizedUrl;
  }

  return "";
}

export function isResolvableSocialLink(link: SocialLinkEntry): boolean {
  const href = resolveSocialProfileUrl(link);
  return href.length > 0 && href !== "#";
}
