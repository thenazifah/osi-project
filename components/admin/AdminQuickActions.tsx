"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Database,
  FileText,
  Loader2,
  Package,
  RefreshCw,
  Share2,
} from "lucide-react";
import {
  seedProductsFromStatic,
  seedSiteContentFromMessages,
  seedSiteSettingsFromDefaults,
  syncPublicSite,
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Feedback = { type: "success" | "error"; message: string } | null;

export function AdminQuickActions({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback>(null);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    window.setTimeout(() => setFeedback(null), 5000);
  };

  const runCount = (action: () => Promise<{ count: number }>, label: string) => {
    startTransition(async () => {
      try {
        const { count } = await action();
        showFeedback("success", `${label}: synced ${count} record(s).`);
        router.refresh();
      } catch (e) {
        showFeedback("error", e instanceof Error ? e.message : `${label} failed.`);
      }
    });
  };

  const runSuccess = (action: () => Promise<{ success: boolean }>, label: string) => {
    startTransition(async () => {
      try {
        await action();
        showFeedback("success", `${label} complete. Public site updated.`);
        router.refresh();
      } catch (e) {
        showFeedback("error", e instanceof Error ? e.message : `${label} failed.`);
      }
    });
  };

  const runRevalidate = () => {
    startTransition(async () => {
      try {
        const { pages } = await syncPublicSite();
        showFeedback("success", `Storefront revalidated (${pages} page groups).`);
        router.refresh();
      } catch (e) {
        showFeedback("error", e instanceof Error ? e.message : "Revalidate failed.");
      }
    });
  };

  const actions = [
    {
      label: "Import products",
      icon: Package,
      onClick: () => runCount(seedProductsFromStatic, "Products"),
    },
    {
      label: "Seed site copy",
      icon: FileText,
      onClick: () => runCount(seedSiteContentFromMessages, "Content"),
    },
    {
      label: "Sync images & social",
      icon: Share2,
      onClick: () =>
        runSuccess(seedSiteSettingsFromDefaults, "Site settings (images & social)"),
    },
    {
      label: "Revalidate storefront",
      icon: RefreshCw,
      onClick: runRevalidate,
    },
  ] as const;

  return (
    <Card className="admin-panel admin-dashboard-enter admin-dashboard-enter-6 border-border/80 bg-surface/90 shadow-[0_2px_12px_rgba(11,31,42,0.04)] backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick sync</CardTitle>
        <p className="font-sans text-xs leading-relaxed text-ink-muted">
          Push dashboard data to the live landing page, product pages, social links,
          and images.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {actions.map(({ label, icon: Icon, onClick }) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              size="sm"
              className="h-10 justify-start rounded-xl border-border/80 bg-bg/40 hover:border-sea/30 hover:bg-surface"
              disabled={disabled || isPending}
              onClick={onClick}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              {label}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start rounded-xl"
          disabled={disabled || isPending}
          asChild
        >
          <a href="/en" target="_blank" rel="noopener noreferrer">
            <Database className="h-4 w-4" />
            Preview live site
          </a>
        </Button>

        {feedback ? (
          <div
            className={cn(
              "flex items-start gap-2 rounded-xl border px-3 py-2.5 font-sans text-xs animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            )}
            role="status"
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : null}
            {feedback.message}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
