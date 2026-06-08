import Nav from "@/components/sections/Nav";
import type { SocialLinkItem } from "@/components/footer/SocialLinks";
import { getPublicSiteSettings } from "@/lib/cms";
import { getPublicSocialLinkItems } from "@/lib/social-links";

type SiteNavProps = {
  socialLinks?: SocialLinkItem[];
};

export default async function SiteNav({ socialLinks }: SiteNavProps) {
  const links =
    socialLinks ?? getPublicSocialLinkItems(await getPublicSiteSettings());

  return <Nav socialLinks={links} />;
}
