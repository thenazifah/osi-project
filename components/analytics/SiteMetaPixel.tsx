import { MetaPixel } from "@/components/analytics/MetaPixel";
import { getPublicSiteSettings } from "@/lib/cms";
import { resolveActiveMetaPixel } from "@/lib/meta-pixel";

export default async function SiteMetaPixel() {
  const settings = await getPublicSiteSettings();
  const pixelId = resolveActiveMetaPixel(settings);

  if (!pixelId) return null;

  return <MetaPixel pixelId={pixelId} />;
}
