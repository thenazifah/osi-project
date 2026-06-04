import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { RecentRfqList } from "@/components/admin/RecentRfqList";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDashboardChartData,
  getDashboardStats,
  listRecentRfqSubmissions,
} from "@/lib/admin-actions";
import { isAdminConfigured } from "@/lib/firebase-admin";

export default async function AdminOverviewPage() {
  const firebaseReady = isAdminConfigured();

  if (!firebaseReady) {
    return (
      <div className="space-y-8">
        <AdminPageHeader
          eyebrow="Overview"
          title="OSI Admin Dashboard"
          description="You are signed in. Connect Firestore using the setup steps above to load RFQs, products, and site content."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { href: "/admin/rfq", title: "RFQ Inbox", text: "Quote requests from the public form." },
            { href: "/admin/products", title: "Products", text: "Catalog CRUD synced to the live site." },
            { href: "/admin/content", title: "Site Content", text: "Hero, about, and trust copy per locale." },
          ].map((item) => (
            <Card key={item.href} className="border-border bg-surface">
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

  let stats = { rfqTotal: 0, rfqNew: 0, productCount: 0, contentLocales: 0 };
  let charts = {
    rfqByStatus: [] as { status: string; count: number }[],
    rfqByMonth: [] as { month: string; count: number }[],
    productsByCategory: [] as { category: string; count: number }[],
  };
  let recent: Awaited<ReturnType<typeof listRecentRfqSubmissions>> = [];
  let error: string | null = null;

  try {
    [stats, charts, recent] = await Promise.all([
      getDashboardStats(),
      getDashboardChartData(),
      listRecentRfqSubmissions(5),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load dashboard";
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Overview"
        title="OSI Admin Dashboard"
        description="Live sync with the public site (EN / JA / ZH). Changes to products and content revalidate storefront pages automatically."
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="RFQ submissions"
          value={stats.rfqTotal}
          href="/admin/rfq"
        />
        <StatCard
          label="New inquiries"
          value={stats.rfqNew}
          hint="Needs review"
          href="/admin/rfq"
        />
        <StatCard
          label="Products"
          value={stats.productCount}
          href="/admin/products"
        />
        <StatCard
          label="Content locales"
          value={stats.contentLocales}
          hint="EN · JA · ZH"
          href="/admin/content"
        />
      </div>

      {!error ? (
        <>
          <DashboardCharts data={charts} />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <RecentRfqList submissions={recent} />
            <AdminQuickActions />
          </div>
        </>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            href: "/admin/rfq",
            title: "RFQ Inbox",
            text: "Review and update quote request status.",
          },
          {
            href: "/admin/products",
            title: "Products",
            text: "Full CRUD for catalog items, specs, and images.",
          },
          {
            href: "/admin/content",
            title: "Site Content",
            text: "Edit hero, about, and trust copy per locale.",
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
