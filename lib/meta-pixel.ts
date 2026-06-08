import type { SiteSettings } from "@/lib/site-settings";

export type MetaPixelSettings = {
  enabled: boolean;
  pixelId: string;
};

export function normalizePixelId(id: string): string | null {
  const trimmed = id.trim();
  if (!/^\d{8,20}$/.test(trimmed)) return null;
  return trimmed;
}

export function defaultMetaPixelSettings(): MetaPixelSettings {
  const envId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";
  return {
    enabled: Boolean(envId),
    pixelId: envId,
  };
}

export function mergeMetaPixelSettings(stored: unknown): MetaPixelSettings {
  const defaults = defaultMetaPixelSettings();
  if (!stored || typeof stored !== "object") return defaults;

  const raw = stored as Partial<MetaPixelSettings>;
  const pixelId = String(raw.pixelId ?? defaults.pixelId).trim();

  return {
    enabled:
      typeof raw.enabled === "boolean" ? raw.enabled : defaults.enabled,
    pixelId,
  };
}

export function resolveActiveMetaPixel(settings: SiteSettings): string | null {
  const config = settings.metaPixel ?? defaultMetaPixelSettings();
  if (!config.enabled) return null;

  return (
    normalizePixelId(config.pixelId) ??
    normalizePixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "")
  );
}

export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
