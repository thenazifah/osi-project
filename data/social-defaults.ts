import type { SocialPlatform } from "@/lib/site-settings";

/** Shown when admin/env URLs are not set yet — replace in /admin/site */
export const OSI_SOCIAL_BUNDLED: Partial<
  Record<SocialPlatform, { url: string; handle: string }>
> = {
  whatsapp: { url: "", handle: "" },
  wechat: { url: "https://www.wechat.com/", handle: "organicscales" },
  line: { url: "https://line.me/", handle: "@organicscales" },
  facebook: { url: "https://www.facebook.com/", handle: "organicscales" },
  instagram: { url: "https://www.instagram.com/", handle: "@organicscales" },
  tiktok: { url: "https://www.tiktok.com/", handle: "@organicscales" },
};
