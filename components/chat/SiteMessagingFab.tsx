import FloatingMessageButton from "@/components/chat/FloatingMessageButton";
import { buildSocialLinkItems } from "@/components/footer/SocialLinks";
import { getPublicSiteSettings } from "@/lib/cms";
import { buildMessagingChannels } from "@/lib/messaging-channels";
import { activeSocialLinks } from "@/lib/site-settings";
import {
  normalizeWhatsAppPhone,
  resolveMessagingWhatsAppUrl,
} from "@/lib/whatsapp";

type SiteMessagingFabProps = {
  locale: string;
};

export default async function SiteMessagingFab({ locale }: SiteMessagingFabProps) {
  const siteSettings = await getPublicSiteSettings();
  const links = activeSocialLinks(siteSettings);
  const socialLinks = buildSocialLinkItems(links);
  const whatsappUrl = resolveMessagingWhatsAppUrl(siteSettings, locale);
  const waLink =
    siteSettings.socialLinks.find((link) => link.platform === "whatsapp") ??
    links.find((link) => link.platform === "whatsapp");
  const waSource = waLink?.handle.trim() || waLink?.url.trim() || "";
  const whatsappHandle =
    waSource && !/^https?:\/\//i.test(waSource)
      ? normalizeWhatsAppPhone(waSource)
        ? `+${normalizeWhatsAppPhone(waSource)}`
        : waSource
      : waSource || undefined;

  const channels = buildMessagingChannels(socialLinks, {
    whatsappUrl,
    whatsappHandle,
  });

  return <FloatingMessageButton locale={locale} channels={channels} />;
}
