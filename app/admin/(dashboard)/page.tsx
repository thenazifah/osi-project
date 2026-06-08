import {
  FileText,
  Globe,
  ImageIcon,
  Inbox,
  Package,
  Share2,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import {
  DashboardModules,
  DashboardModulesFallback,
} from "@/components/admin/DashboardModules";
import { DashboardWelcome } from "@/components/admin/DashboardWelcome";
import { RecentRfqList } from "@/components/admin/RecentRfqList";
import { StatCard } from "@/components/admin/StatCard";
import {
  getDashboardChartData,
  getDashboardStats,
  listRecentRfqSubmissions,
} from "@/lib/admin-actions";
import { getAdminSessionEmail } from "@/lib/admin-auth";
import { isAdminConfigured } from "@/lib/firebase-admin";

export default async function AdminOverviewPage() {
  const firebaseReady = isAdminConfigured();
  const email = await getAdminSessionEmail();

  if (!firebaseReady) {
    return (
      <div className="admin-dashboard-content space-y-8">
        <AdminPageHeader
          eyebrow="Overview"
          title="OSI Admin Dashboard"
          description="You are signed in. Connect Firestore using the setup steps above to load RFQs, products, and site content."
        />
        <DashboardModulesFallback />
      </div>
    );
  }

  let stats = {
    rfqTotal: 0,
    rfqNew: 0,
    productCount: 0,
    contentLocales: 0,
    socialLinks: 0,
    siteImages: 0,
  };
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
    <div className="admin-dashboard-content space-y-8">
      <DashboardWelcome
        email={email}
        rfqNew={stats.rfqNew}
        productCount={stats.productCount}
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="RFQ submissions"
          value={stats.rfqTotal}
          href="/admin/rfq"
          icon={Inbox}
          tone="sea"
          delayIndex={2}
        />
        <StatCard
          label="New inquiries"
          value={stats.rfqNew}
          hint="Needs review"
          href="/admin/rfq"
          icon={FileText}
          tone="alert"
          delayIndex={3}
        />
        <StatCard
          label="Products"
          value={stats.productCount}
          href="/admin/products"
          icon={Package}
          tone="teal"
          delayIndex={4}
        />
        <StatCard
          label="Content locales"
          value={stats.contentLocales}
          hint="EN · JA · ZH"
          href="/admin/content"
          icon={Globe}
          tone="ink"
          delayIndex={5}
        />
        <StatCard
          label="Social links"
          value={stats.socialLinks}
          hint="Header · hero · footer"
          href="/admin/site"
          icon={Share2}
          tone="nav"
          delayIndex={6}
        />
        <StatCard
          label="Site images"
          value={stats.siteImages}
          hint="Hero · trust · export · process"
          href="/admin/site"
          icon={ImageIcon}
          tone="gold"
          delayIndex={7}
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

      <div className="space-y-4">
        <div className="admin-dashboard-enter admin-dashboard-enter-7">
          <h2 className="font-display text-lg text-ink">Modules</h2>
          <p className="mt-1 font-sans text-sm text-ink-muted">
            Jump straight into RFQs, catalog, content, or site settings.
          </p>
        </div>
        <DashboardModules />
      </div>
    </div>
  );
}
