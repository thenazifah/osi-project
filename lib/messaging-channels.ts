import type { SocialLinkItem } from "@/components/footer/SocialLinks";
import { OSI_SOCIAL_BUNDLED } from "@/data/social-defaults";
import { PLATFORM_LABELS, type SocialPlatform } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const MESSAGING_PLATFORMS: SocialPlatform[] = [
  "whatsapp",
  "wechat",
  "line",
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "linkedin",
  "x",
];

export type MessagingChannelKind = "external" | "email" | "rfq";

export type MessagingChannel = {
  id: string;
  kind: MessagingChannelKind;
  platform: SocialPlatform | "email" | "rfq";
  label: string;
  href?: string;
  handle?: string;
};

const PROCUREMENT_EMAIL = "procurement@organicscales.com";

function platformSortIndex(platform: SocialPlatform | "email" | "rfq"): number {
  const index = MESSAGING_PLATFORMS.indexOf(platform as SocialPlatform);
  return index === -1 ? MESSAGING_PLATFORMS.length + 1 : index;
}

function fallbackWhatsappHref(): string | null {
  const bundled = OSI_SOCIAL_BUNDLED.whatsapp;
  const source = bundled?.handle.trim() || bundled?.url.trim() || "";
  return source ? buildWhatsAppUrl(source) : null;
}

export function buildMessagingChannels(
  socialLinks: SocialLinkItem[],
  options?: { whatsappUrl?: string | null; whatsappHandle?: string }
): MessagingChannel[] {
  const externalByPlatform = new Map<SocialPlatform, MessagingChannel>();

  for (const link of socialLinks) {
    externalByPlatform.set(link.platform, {
      id: link.id,
      kind: "external",
      platform: link.platform,
      label: link.label,
      href: link.href,
      handle: link.handle,
    });
  }

  const whatsappUrl =
    options?.whatsappUrl?.trim() || fallbackWhatsappHref() || null;

  if (whatsappUrl) {
    const existing = externalByPlatform.get("whatsapp");
    externalByPlatform.set("whatsapp", {
      id: existing?.id ?? "whatsapp",
      kind: "external",
      platform: "whatsapp",
      label: existing?.label ?? PLATFORM_LABELS.whatsapp,
      href: whatsappUrl,
      handle:
        options?.whatsappHandle?.trim() ||
        existing?.handle?.trim() ||
        OSI_SOCIAL_BUNDLED.whatsapp?.handle.trim() ||
        undefined,
    });
  }

  const external = [...externalByPlatform.values()].sort(
    (a, b) => platformSortIndex(a.platform) - platformSortIndex(b.platform)
  );

  return [
    ...external,
    {
      id: "email",
      kind: "email",
      platform: "email",
      label: "Email",
      href: `mailto:${PROCUREMENT_EMAIL}`,
      handle: PROCUREMENT_EMAIL,
    },
    {
      id: "rfq",
      kind: "rfq",
      platform: "rfq",
      label: "RFQ",
    },
  ];
}
