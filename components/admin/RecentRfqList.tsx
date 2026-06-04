import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RfqSubmission } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  quoted: "Quoted",
  closed: "Closed",
};

export function RecentRfqList({ submissions }: { submissions: RfqSubmission[] }) {
  return (
    <Card className="border-border bg-surface">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Recent inquiries</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/rfq">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {submissions.length === 0 ? (
          <p className="py-6 text-center font-sans text-sm text-ink-muted">
            No RFQ submissions yet. They appear here when visitors submit the quote form.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {submissions.map((row) => (
              <li key={row.id} className="flex flex-wrap items-start justify-between gap-3 py-4 first:pt-0">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{row.companyName}</p>
                  <p className="mt-0.5 font-sans text-xs text-ink-muted">
                    {row.contactPerson} · {row.country} · {row.quantityKg.toLocaleString()} kg
                  </p>
                  <p className="mt-0.5 truncate font-sans text-xs text-ink-muted">{row.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {STATUS_LABEL[row.status] ?? row.status}
                  </Badge>
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
