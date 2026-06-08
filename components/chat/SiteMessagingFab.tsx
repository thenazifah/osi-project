import FloatingMessageButton from "@/components/chat/FloatingMessageButton";
import { buildSocialLinkItems } from "@/components/footer/SocialLinks";
import { getPublicSiteSettings } from "@/lib/cms";
import { buildMessagingChannels } from "@/lib/messaging-channels";
import { activeSocialLinks } from "@/lib/site-settings";
import { resolveWhatsAppUrl } from "@/lib/whatsapp";

type SiteMessagingFabProps = {
  locale: string;
};

export default async function SiteMessagingFab({ locale }: SiteMessagingFabProps) {
  const siteSettings = await getPublicSiteSettings();
  const socialLinks = buildSocialLinkItems(activeSocialLinks(siteSettings));
  const channels = buildMessagingChannels(socialLinks);
  const whatsappUrl = resolveWhatsAppUrl(siteSettings, locale);

  return (
    <FloatingMessageButton
      locale={locale}
      whatsappUrl={whatsappUrl}
      channels={channels}
    />
  );
}
