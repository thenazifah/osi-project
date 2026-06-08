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

export function resolveWhatsAppUrl(
  settings: SiteSettings,
  locale: string
): string | null {
  const envNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ||
    process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP?.trim();

  const links = activeSocialLinks(settings);
  const waLink = links.find((link) => link.platform === "whatsapp");
  const source = waLink?.url.trim() || waLink?.handle.trim() || envNumber || "";
  if (!source) return null;

  const message = DEFAULT_MESSAGES[locale] ?? DEFAULT_MESSAGES.en;
  return buildWhatsAppUrl(source, message);
}
