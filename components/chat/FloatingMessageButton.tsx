"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, Mail, X } from "lucide-react";
import { SOCIAL_PLATFORM_ICONS } from "@/components/footer/SocialLinks";
import type { MessagingChannel } from "@/lib/messaging-channels";
import { trackMetaEvent } from "@/lib/meta-pixel";
import type { SocialPlatform } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

type FloatingMessageButtonProps = {
  locale: string;
  whatsappUrl: string | null;
  channels: MessagingChannel[];
};

function ChannelIcon({
  platform,
}: {
  platform: MessagingChannel["platform"];
}) {
  if (platform === "email") {
    return <Mail className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />;
  }
  if (platform === "rfq") {
    return (
      <FileText className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
    );
  }
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center">
      {SOCIAL_PLATFORM_ICONS[platform as SocialPlatform]}
    </span>
  );
}

export default function FloatingMessageButton({
  locale,
  whatsappUrl,
  channels,
}: FloatingMessageButtonProps) {
  const t = useTranslations("messagingFab");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const goToRfq = () => {
    setOpen(false);
    const rfq = document.getElementById("rfq");
    if (rfq) {
      rfq.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.href = `/${locale}#rfq`;
  };

  if (whatsappUrl) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackMetaEvent("Contact", { content_name: "WhatsApp" })}
        aria-label={t("whatsappLabel")}
        title={t("whatsappLabel")}
        className={cn(
          "fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] sm:bottom-6 sm:right-6",
          "bg-[#25D366] shadow-[#25D366]/30"
        )}
      >
        <span
          className="absolute inset-0 rounded-full bg-[#25D366]/50 animate-ping"
          aria-hidden
        />
        <span className="relative flex h-7 w-7 items-center justify-center text-white">
          {SOCIAL_PLATFORM_ICONS.whatsapp}
        </span>
      </a>
    );
  }

  const externalChannels = channels.filter((c) => c.kind === "external");
  const emailChannel = channels.find((c) => c.kind === "email");
  const hasRfq = channels.some((c) => c.kind === "rfq");

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      <div
        className={cn(
          "pointer-events-auto w-[min(18rem,calc(100vw-2.5rem))] origin-bottom-right transition-all duration-200",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-bg/95 shadow-xl shadow-accent/10 backdrop-blur-md">
          <div className="border-b border-border/60 bg-gradient-to-r from-accent to-accent-2 px-4 py-3 text-white">
            <p className="text-sm font-semibold">{t("title")}</p>
            <p className="text-xs text-white/85">{t("subtitle")}</p>
          </div>
          <ul className="max-h-[min(16rem,50vh)] overflow-y-auto p-2">
            {externalChannels.map((channel) => (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-tag-bg"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-accent">
                    <ChannelIcon platform={channel.platform} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{channel.label}</span>
                    {channel.handle ? (
                      <span className="block truncate text-xs text-ink-muted">
                        {channel.handle}
                      </span>
                    ) : null}
                  </span>
                </a>
              </li>
            ))}
            {emailChannel ? (
              <li>
                <a
                  href={emailChannel.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink transition-colors hover:bg-tag-bg"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-accent">
                    <ChannelIcon platform="email" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{t("email")}</span>
                    <span className="block truncate text-xs text-ink-muted">
                      {emailChannel.handle}
                    </span>
                  </span>
                </a>
              </li>
            ) : null}
            {hasRfq ? (
              <li>
                <button
                  type="button"
                  onClick={goToRfq}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-tag-bg"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-accent">
                    <ChannelIcon platform="rfq" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{t("rfq")}</span>
                    <span className="block text-xs text-ink-muted">
                      {t("rfqHint")}
                    </span>
                  </span>
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? t("closeLabel") : t("openLabel")}
        className={cn(
          "pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-accent/25 transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2",
          "bg-gradient-to-br from-accent to-accent-2"
        )}
      >
        {!open ? (
          <span
            className="absolute inset-0 rounded-full bg-accent-2/40 animate-ping"
            aria-hidden
          />
        ) : null}
        {open ? (
          <X className="relative h-6 w-6" strokeWidth={2} aria-hidden />
        ) : (
          <span className="relative flex h-6 w-6 items-center justify-center">
            {SOCIAL_PLATFORM_ICONS.whatsapp}
          </span>
        )}
      </button>
    </div>
  );
}
