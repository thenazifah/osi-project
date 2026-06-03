import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/admin-actions";
import { isAdminConfigured } from "@/lib/firebase-admin";

export default async function AdminOverviewPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl text-ink">Setup required</h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">
          Add <code className="rounded bg-tag-bg px-1">FIREBASE_SERVICE_ACCOUNT_KEY</code>{" "}
          and <code className="rounded bg-tag-bg px-1">ADMIN_PASSWORD</code> to{" "}
          <code className="rounded bg-tag-bg px-1">.env.local</code>, then restart the dev
          server.
        </p>
      </div>
    );
  }

  let stats = { rfqTotal: 0, rfqNew: 0, productCount: 0, contentLocales: 0 };
  let error: string | null = null;

  try {
    stats = await getDashboardStats();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load dashboard stats";
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-sea">
          Overview
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink">Content Dashboard</h1>
        <p className="mt-2 max-w-2xl font-sans text-sm text-ink-muted">
          Manage RFQ leads, catalog products, and public site copy for EN / JA / ZH.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="RFQ submissions" value={stats.rfqTotal} />
        <StatCard label="New inquiries" value={stats.rfqNew} hint="Status: new" />
        <StatCard label="Products" value={stats.productCount} />
        <StatCard label="Content locales" value={stats.contentLocales} hint="EN · JA · ZH" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { href: "/admin/rfq", title: "RFQ Inbox", text: "Review and update quote requests." },
          {
            href: "/admin/products",
            title: "Products",
            text: "Edit catalog items stored in Firestore.",
          },
          {
            href: "/admin/content",
            title: "Site Content",
            text: "Update hero, about, and trust copy per locale.",
          },
        ].map((item) => (
          <Card key={item.href} className="card-interactive border-border bg-surface">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <p className="font-sans text-sm text-ink-muted">{item.text}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={item.href}>
                  Open
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
