"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Database, FileText, Package, RefreshCw, Share2 } from "lucide-react";
import {
  seedProductsFromStatic,
  seedSiteContentFromMessages,
  seedSiteSettingsFromDefaults,
  syncPublicSite,
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminQuickActions({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const runCount = (action: () => Promise<{ count: number }>, label: string) => {
    startTransition(async () => {
      try {
        const { count } = await action();
        alert(`${label}: synced ${count} record(s).`);
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : `${label} failed.`);
      }
    });
  };

  const runSuccess = (action: () => Promise<{ success: boolean }>, label: string) => {
    startTransition(async () => {
      try {
        await action();
        alert(`${label} complete. Public site updated.`);
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : `${label} failed.`);
      }
    });
  };

  const runRevalidate = () => {
    startTransition(async () => {
      try {
        const { pages } = await syncPublicSite();
        alert(`Storefront revalidated (${pages} page groups).`);
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Revalidate failed.");
      }
    });
  };

  return (
    <Card className="border-border bg-surface">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick sync</CardTitle>
        <p className="font-sans text-xs text-ink-muted">
          Push dashboard data to the live landing page, product pages, social links, and images.
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pt-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isPending}
          onClick={() => runCount(seedProductsFromStatic, "Products")}
        >
          <Package className="h-4 w-4" />
          Import products
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isPending}
          onClick={() => runCount(seedSiteContentFromMessages, "Content")}
        >
          <FileText className="h-4 w-4" />
          Seed site copy
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isPending}
          onClick={() =>
            runSuccess(seedSiteSettingsFromDefaults, "Site settings (images & social)")
          }
        >
          <Share2 className="h-4 w-4" />
          Sync images & social
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isPending}
          onClick={runRevalidate}
        >
          <RefreshCw className="h-4 w-4" />
          Revalidate storefront
        </Button>
        <Button type="button" variant="ghost" size="sm" disabled={disabled || isPending} asChild>
          <a href="/en" target="_blank" rel="noopener noreferrer">
            <Database className="h-4 w-4" />
            Preview site
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
