import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RfqTable } from "@/components/admin/RfqTable";
import { StatCard } from "@/components/admin/StatCard";
import { listRfqSubmissions } from "@/lib/admin-actions";
import type { RfqSubmission, RfqStatus } from "@/lib/admin-types";
import { isAdminConfigured } from "@/lib/firebase-admin";

export default async function AdminRfqPage() {
  const firebaseReady = isAdminConfigured();

  if (!firebaseReady) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="RFQ Inbox"
          title="Quote requests"
          description="Connect Firestore to load submissions from the public RFQ form."
        />
      </div>
    );
  }

  let submissions: RfqSubmission[] = [];
  let error: string | null = null;

  try {
    submissions = await listRfqSubmissions();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load RFQ submissions";
  }

  const byStatus = (status: RfqStatus) =>
    submissions.filter((s) => s.status === status).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="RFQ Inbox"
        title="Quote requests"
        description="Submissions from the public RFQ form. Status updates sync to the overview charts and sidebar counts."
      />

      {!error ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="New" value={byStatus("new")} />
          <StatCard label="Reviewing" value={byStatus("reviewing")} />
          <StatCard label="Quoted" value={byStatus("quoted")} />
          <StatCard label="Closed" value={byStatus("closed")} />
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {error}
        </p>
      ) : (
        <RfqTable submissions={submissions} />
      )}
    </div>
  );
}
