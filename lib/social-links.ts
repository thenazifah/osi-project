import { buildSocialLinkItems, type SocialLinkItem } from "@/components/footer/SocialLinks";
import type { SiteSettings } from "@/lib/site-settings";
import { activeSocialLinks } from "@/lib/site-settings";

export function getPublicSocialLinkItems(
  settings: SiteSettings
): SocialLinkItem[] {
  return buildSocialLinkItems(activeSocialLinks(settings));
}
