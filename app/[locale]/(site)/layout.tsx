import SiteMetaPixel from "@/components/analytics/SiteMetaPixel";
import SiteMessagingFab from "@/components/chat/SiteMessagingFab";
import SiteNav from "@/components/nav/SiteNav";
import { getPublicSiteSettings } from "@/lib/cms";
import { getPublicSocialLinkItems } from "@/lib/social-links";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { locale } = await params;
  const socialLinks = getPublicSocialLinkItems(await getPublicSiteSettings());

  return (
    <>
      <SiteMetaPixel />
      <SiteNav socialLinks={socialLinks} />
      {children}
      <SiteMessagingFab locale={locale} />
    </>
  );
}
