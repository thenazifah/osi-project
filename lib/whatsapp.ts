import { OSI_SOCIAL_BUNDLED } from "@/data/social-defaults";
import type { SiteSettings } from "@/lib/site-settings";
import { activeSocialLinks } from "@/lib/site-settings";

const DEFAULT_MESSAGES: Record<string, string> = {
  en: "Hello OSI, I'm interested in fish scales procurement.",
  ja: "こんにちは、魚鱗の調達についてお問い合わせします。",
  zh: "您好，我想咨询鱼鳞采购事宜。",
};

export function normalizeWhatsAppPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export function buildWhatsAppUrl(
  phoneOrUrl: string,
  message?: string
): string | null {
  const trimmed = phoneOrUrl.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    if (!message) return trimmed;
    try {
      const url = new URL(trimmed);
      if (!url.searchParams.has("text")) {
        url.searchParams.set("text", message);
      }
      return url.toString();
    } catch {
      return trimmed;
    }
  }

  const digits = normalizeWhatsAppPhone(trimmed);
  if (!digits) return null;

  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

function whatsappCandidates(settings: SiteSettings): string[] {
  const envNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ||
    process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP?.trim();
  const storedWa = settings.socialLinks.find((link) => link.platform === "whatsapp");
  const activeWa = activeSocialLinks(settings).find(
    (link) => link.platform === "whatsapp"
  );
  const waLink = storedWa ?? activeWa;
  const bundled = OSI_SOCIAL_BUNDLED.whatsapp;

  return [
    waLink?.url.trim(),
    waLink?.handle.trim(),
    envNumber,
    bundled?.handle.trim(),
    bundled?.url.trim(),
  ].filter((value): value is string => Boolean(value?.trim()));
}

export function resolveWhatsAppUrl(
  settings: SiteSettings,
  locale: string
): string | null {
  const message = DEFAULT_MESSAGES[locale] ?? DEFAULT_MESSAGES.en;

  for (const candidate of whatsappCandidates(settings)) {
    const url = buildWhatsAppUrl(candidate, message);
    if (url) return url;
  }

  return null;
}

/** WhatsApp link for messaging menu — works even when admin handle is not a phone number. */
export function resolveMessagingWhatsAppUrl(
  settings: SiteSettings,
  locale: string
): string | null {
  return resolveWhatsAppUrl(settings, locale);
}
