import type { ReactNode } from "react";
import { Link2 } from "lucide-react";
import type { SocialLinkEntry, SocialPlatform } from "@/lib/site-settings";
import { PLATFORM_LABELS } from "@/lib/site-settings";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type SocialLinkItem = {
  id: string;
  platform: SocialPlatform;
  label: string;
  href: string;
  handle?: string;
};

const SIZE_STYLES = {
  sm: { button: "h-10 w-10", icon: "[&_svg]:h-5 [&_svg]:w-5" },
  md: { button: "h-11 w-11", icon: "[&_svg]:h-5 [&_svg]:w-5" },
  lg: { button: "h-14 w-14", icon: "[&_svg]:h-7 [&_svg]:w-7" },
} as const;

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
  links: SocialLinkItem[];
  size?: keyof typeof SIZE_STYLES;
  showLabels?: boolean;
};

export const SOCIAL_PLATFORM_ICONS: Record<SocialPlatform, ReactNode> = {
  whatsapp: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  wechat: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M8.5 3C4.9 3 2 5.4 2 8.3c0 1.5.8 2.9 2.1 3.9L3.5 15l2.9-1.5c.8.2 1.6.4 2.5.4.1 0 .3 0 .4-.1-.2-.6-.3-1.2-.3-1.8 0-3.3 3.2-6 7.2-6 .4 0 .8 0 1.2.1C16.8 4.5 13 3 8.5 3zm-2.8 4.1c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm5.6 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zM22 14.5c0-2.5-2.5-4.5-5.6-4.5S10.8 12 10.8 14.5s2.5 4.5 5.6 4.5c.7 0 1.3-.1 1.9-.3l1.7.9-.5-1.6c1-.8 1.6-2 1.6-3.5zm-7.5-1.2c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7zm3.8 0c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z" />
    </svg>
  ),
  line: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M19.5 3h-15A3.5 3.5 0 0 0 1 6.5v11A3.5 3.5 0 0 0 4.5 21h15a3.5 3.5 0 0 0 3.5-3.5v-11A3.5 3.5 0 0 0 19.5 3zM8.2 14.6H6.4V8.9h1.8v5.7zm3.1 0h-1.6V8.9h1.6l2.4 3.9V8.9h1.6v5.7h-1.6l-2.4-3.9v3.9zm6.9 0h-3.5V8.9h3.4v1.4h-1.7v.9h1.6v1.3h-1.6v1.1h1.7v1z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.9c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7v3.2h2.1v8h4.4z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5.25-3.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M16.5 3h-2.2c.2 1.4.9 2.7 2 3.5 1 .7 2.2 1 3.4.9V8.2c-1.2 0-2.3-.4-3.3-1.1v7.5a5.4 5.4 0 1 1-5.4-5.4c.3 0 .5 0 .8.1v2.3a3.1 3.1 0 1 0 2.2 3V3z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M4.5 3A2.5 2.5 0 1 0 4.5 8 2.5 2.5 0 0 0 4.5 3zM3 9h3v12H3V9zm7 0h2.9v1.6h.1c.4-.8 1.5-1.6 3.1-1.6 3.3 0 3.9 2.2 3.9 5v6H17v-5.3c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V21h-3V9z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="m4 4 7.5 9.6L4.2 20h2.5l5.2-5.8L15.8 20H20l-7.8-10.2L19.3 4h-2.5l-4.8 5.4L8.2 4H4z" />
    </svg>
  ),
  custom: <Link2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />,
};

function resolveSocialHref(link: SocialLinkEntry): string {
  const url = link.url.trim();
  const handle = link.handle.trim();

  if (link.platform === "whatsapp") {
    return (
      buildWhatsAppUrl(url || handle) ??
      url ||
      handle
    );
  }

  return url;
}

export function buildSocialLinkItems(links: SocialLinkEntry[]): SocialLinkItem[] {
  return links
    .filter((link) => {
      const href = resolveSocialHref(link);
      return href.length > 0 && href !== "#";
    })
    .map((link) => ({
      id: link.id,
      platform: link.platform,
      label: link.label.trim() || PLATFORM_LABELS[link.platform],
      href: resolveSocialHref(link),
      handle: link.handle.trim() || undefined,
    }));
}

export function SocialLinks({
  className,
  iconClassName,
  links,
  size = "sm",
  showLabels = false,
}: SocialLinksProps) {
  if (links.length === 0) return null;

  const sizeStyle = SIZE_STYLES[size];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center",
        showLabels ? "gap-4 sm:gap-5" : "gap-2",
        className
      )}
    >
      {links.map(({ id, platform, label, href, handle }) => (
        <a
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={handle ? `${label}: ${handle}` : label}
          title={handle || label}
          className={cn(
            "group/social transition-transform duration-200 hover:-translate-y-0.5",
            showLabels && "flex min-w-[4.5rem] flex-col items-center gap-2"
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center rounded-full border border-border bg-bg text-ink-muted shadow-sm transition-colors duration-200 hover:border-accent-2/50 hover:bg-tag-bg hover:text-accent hover:shadow-md",
              sizeStyle.button,
              sizeStyle.icon,
              iconClassName
            )}
          >
            {SOCIAL_PLATFORM_ICONS[platform]}
          </span>
          {showLabels ? (
            <span className="max-w-[5.5rem] text-center font-sans text-[11px] font-semibold leading-tight text-ink-muted transition-colors group-hover/social:text-accent">
              {label}
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
