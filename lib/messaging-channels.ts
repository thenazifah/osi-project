import type { SocialLinkItem } from "@/components/footer/SocialLinks";
import type { SocialPlatform } from "@/lib/site-settings";

export const MESSAGING_PLATFORMS: SocialPlatform[] = [
  "whatsapp",
  "wechat",
  "line",
  "facebook",
  "instagram",
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

export function buildMessagingChannels(
  socialLinks: SocialLinkItem[]
): MessagingChannel[] {
  const external = socialLinks
    .filter((link) => MESSAGING_PLATFORMS.includes(link.platform))
    .map((link) => ({
      id: link.id,
      kind: "external" as const,
      platform: link.platform,
      label: link.label,
      href: link.href,
      handle: link.handle,
    }));

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
