"use client";

import { Sparkles } from "lucide-react";

type DashboardWelcomeProps = {
  email: string | null;
  rfqNew: number;
  productCount: number;
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function displayName(email: string | null): string {
  if (!email) return "there";
  const local = email.split("@")[0] ?? email;
  const name = local.split(/[._-]/)[0] ?? local;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function DashboardWelcome({
  email,
  rfqNew,
  productCount,
}: DashboardWelcomeProps) {
  return (
    <div className="admin-welcome admin-dashboard-enter admin-dashboard-enter-1">
      <div className="admin-welcome-glow" aria-hidden />
      <div className="relative space-y-2">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sea-light/90">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
          Live storefront sync
        </p>
        <h2 className="font-display text-2xl text-bg sm:text-[1.65rem]">
          {greeting()}, {displayName(email)}
        </h2>
        <p className="max-w-xl font-sans text-sm leading-relaxed text-bg/70">
          {rfqNew > 0
            ? `${rfqNew} new RFQ${rfqNew === 1 ? "" : "s"} waiting for review.`
            : "No new inquiries — your pipeline is clear."}{" "}
          {productCount > 0
            ? `${productCount} product${productCount === 1 ? "" : "s"} live on the catalog.`
            : "Import products to populate the catalog."}
        </p>
      </div>
    </div>
  );
}
