"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Database, FileText, Package } from "lucide-react";
import {
  seedProductsFromStatic,
  seedSiteContentFromMessages,
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminQuickActions({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<{ count: number }>, label: string) => {
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

  return (
    <Card className="border-border bg-surface">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Quick sync</CardTitle>
        <p className="font-sans text-xs text-ink-muted">
          Push bundled catalog and translation files into Firestore.
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pt-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isPending}
          onClick={() => run(seedProductsFromStatic, "Products")}
        >
          <Package className="h-4 w-4" />
          Import products
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isPending}
          onClick={() => run(seedSiteContentFromMessages, "Content")}
        >
          <FileText className="h-4 w-4" />
          Seed site copy
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
