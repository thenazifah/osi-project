import { cn } from "@/lib/utils";

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
};

const LINKS = [
  {
    id: "wechat",
    label: "WeChat",
    href: process.env.NEXT_PUBLIC_SOCIAL_WECHAT ?? "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M8.5 3C4.9 3 2 5.4 2 8.3c0 1.5.8 2.9 2.1 3.9L3.5 15l2.9-1.5c.8.2 1.6.4 2.5.4.1 0 .3 0 .4-.1-.2-.6-.3-1.2-.3-1.8 0-3.3 3.2-6 7.2-6 .4 0 .8 0 1.2.1C16.8 4.5 13 3 8.5 3zm-2.8 4.1c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zm5.6 0c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9zM22 14.5c0-2.5-2.5-4.5-5.6-4.5S10.8 12 10.8 14.5s2.5 4.5 5.6 4.5c.7 0 1.3-.1 1.9-.3l1.7.9-.5-1.6c1-.8 1.6-2 1.6-3.5zm-7.5-1.2c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7zm3.8 0c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7z" />
      </svg>
    ),
  },
  {
    id: "line",
    label: "LINE",
    href: process.env.NEXT_PUBLIC_SOCIAL_LINE ?? "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M19.5 3h-15A3.5 3.5 0 0 0 1 6.5v11A3.5 3.5 0 0 0 4.5 21h15a3.5 3.5 0 0 0 3.5-3.5v-11A3.5 3.5 0 0 0 19.5 3zM8.2 14.6H6.4V8.9h1.8v5.7zm3.1 0h-1.6V8.9h1.6l2.4 3.9V8.9h1.6v5.7h-1.6l-2.4-3.9v3.9zm6.9 0h-3.5V8.9h3.4v1.4h-1.7v.9h1.6v1.3h-1.6v1.1h1.7v1z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.9c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7v3.2h2.1v8h4.4z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5.25-3.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK ?? "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M16.5 3h-2.2c.2 1.4.9 2.7 2 3.5 1 .7 2.2 1 3.4.9V8.2c-1.2 0-2.3-.4-3.3-1.1v7.5a5.4 5.4 0 1 1-5.4-5.4c.3 0 .5 0 .8.1v2.3a3.1 3.1 0 1 0 2.2 3V3z" />
      </svg>
    ),
  },
] as const;

export function SocialLinks({ className, iconClassName }: SocialLinksProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {LINKS.map(({ id, label, href, icon }) => (
        <a
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg text-ink-muted transition-colors duration-200 hover:border-accent-2/40 hover:bg-tag-bg hover:text-accent",
            iconClassName
          )}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
