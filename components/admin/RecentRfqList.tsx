import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import type { RfqSubmission } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  quoted: "Quoted",
  closed: "Closed",
};

const STATUS_STYLE: Record<string, string> = {
  new: "border-sky-200 bg-sky-50 text-sky-800",
  reviewing: "border-amber-200 bg-amber-50 text-amber-900",
  quoted: "border-emerald-200 bg-emerald-50 text-emerald-800",
  closed: "border-border bg-tag-bg text-ink-muted",
};

function companyInitial(name: string): string {
  return (name.trim().charAt(0) || "?").toUpperCase();
}

export function RecentRfqList({ submissions }: { submissions: RfqSubmission[] }) {
  return (
    <Card className="admin-panel admin-dashboard-enter admin-dashboard-enter-5 border-border/80 bg-surface/90 shadow-[0_2px_12px_rgba(11,31,42,0.04)] backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Recent inquiries</CardTitle>
        <Button variant="ghost" size="sm" className="rounded-lg" asChild>
          <Link href="/admin/rfq">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-bg/50 px-6 py-10 text-center">
            <Building2 className="h-8 w-8 text-ink-muted/40" strokeWidth={1.5} />
            <p className="font-sans text-sm text-ink-muted">
              No RFQ submissions yet.
            </p>
            <p className="font-sans text-xs text-ink-muted/80">
              They appear here when visitors submit the quote form.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {submissions.map((row) => (
              <li
                key={row.id}
                className="admin-rfq-row flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-bg/40 px-4 py-3 transition-colors duration-200 hover:border-sea/25 hover:bg-surface"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 font-display text-sm text-accent">
                    {companyInitial(row.companyName)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{row.companyName}</p>
                    <p className="mt-0.5 font-sans text-xs text-ink-muted">
                      {row.contactPerson} · {row.country} ·{" "}
                      {row.quantityKg.toLocaleString()} kg
                    </p>
                    <p className="mt-0.5 truncate font-sans text-xs text-ink-muted/80">
                      {row.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={cn(
                      "inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                      STATUS_STYLE[row.status] ?? STATUS_STYLE.closed
                    )}
                  >
                    {STATUS_LABEL[row.status] ?? row.status}
                  </span>
                  <span className="font-sans text-[10px] text-ink-muted">
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
