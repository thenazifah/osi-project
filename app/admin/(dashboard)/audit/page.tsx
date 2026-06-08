import { ClipboardList } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AuditLogViewer } from "@/components/admin/AuditLogViewer";
import { StatCard } from "@/components/admin/StatCard";
import { listAuditLogsForAdmin } from "@/lib/admin-actions";
import type { AuditCategory } from "@/lib/admin-types";
import { isAdminConfigured } from "@/lib/firebase-admin";

export default async function AdminAuditPage() {
  const firebaseReady = isAdminConfigured();

  if (!firebaseReady) {
    return (
      <div className="admin-dashboard-content space-y-6">
        <AdminPageHeader
          eyebrow="Audit"
          title="Audit log"
          description="Connect Firestore to record and review admin activity across the dashboard."
        />
      </div>
    );
  }

  let entries: Awaited<ReturnType<typeof listAuditLogsForAdmin>> = [];
  let error: string | null = null;

  try {
    entries = await listAuditLogsForAdmin(200);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load audit log";
  }

  const today = new Date().toDateString();
  const todayCount = entries.filter(
    (e) => e.createdAt && new Date(e.createdAt).toDateString() === today
  ).length;

  const categoryCount = (cat: AuditCategory) =>
    entries.filter((e) => e.category === cat).length;

  return (
    <div className="admin-dashboard-content space-y-6">
      <AdminPageHeader
        eyebrow="Audit"
        title="Audit log"
        description="Track sign-ins, product edits, RFQ updates, site settings changes, uploads, and storefront syncs."
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {error}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Total events"
              value={entries.length}
              icon={ClipboardList}
              tone="ink"
              delayIndex={2}
            />
            <StatCard
              label="Today"
              value={todayCount}
              hint="Last 24h window"
              tone="teal"
              delayIndex={3}
            />
            <StatCard
              label="Product actions"
              value={categoryCount("product")}
              tone="sea"
              delayIndex={4}
            />
            <StatCard
              label="Auth events"
              value={categoryCount("auth")}
              tone="nav"
              delayIndex={5}
            />
          </div>

          <AuditLogViewer entries={entries} />
        </>
      )}
    </div>
  );
}
