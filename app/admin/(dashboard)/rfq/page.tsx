import { RfqTable } from "@/components/admin/RfqTable";
import { listRfqSubmissions } from "@/lib/admin-actions";
import type { RfqSubmission } from "@/lib/admin-types";

export default async function AdminRfqPage() {
  let submissions: RfqSubmission[] = [];
  let error: string | null = null;

  try {
    submissions = await listRfqSubmissions();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load RFQ submissions";
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-sea">
          RFQ Inbox
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink">Quote requests</h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          Submissions from the public RFQ form. Update status as you review each lead.
        </p>
      </div>

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
