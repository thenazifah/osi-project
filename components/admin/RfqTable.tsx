"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRfqStatus } from "@/lib/admin-actions";
import type { RfqSubmission, RfqStatus } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STATUSES: RfqStatus[] = ["new", "reviewing", "quoted", "closed"];

function statusVariant(status: RfqStatus) {
  switch (status) {
    case "new":
      return "default" as const;
    case "reviewing":
      return "secondary" as const;
    case "quoted":
      return "outline" as const;
    case "closed":
      return "secondary" as const;
  }
}

export function RfqTable({ submissions }: { submissions: RfqSubmission[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(submissions);
  const [isPending, startTransition] = useTransition();

  const onStatusChange = (id: string, status: RfqStatus) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    startTransition(async () => {
      await updateRfqStatus(id, status);
      router.refresh();
    });
  };

  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center font-sans text-sm text-ink-muted">
        No RFQ submissions yet.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface",
        isPending && "opacity-70"
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-tag-bg/50 font-mono text-[10px] uppercase tracking-wider text-sea">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Qty (kg)</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-medium text-ink">{row.companyName}</p>
                  <p className="mt-1 font-sans text-xs text-ink-muted">{row.email}</p>
                  {row.message ? (
                    <p className="mt-2 max-w-xs font-sans text-xs text-ink-muted">
                      {row.message}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4 font-sans text-ink-muted">
                  {row.contactPerson}
                </td>
                <td className="px-4 py-4 font-sans text-ink-muted">{row.country}</td>
                <td className="px-4 py-4 font-mono tabular-nums text-ink">
                  {row.quantityKg.toLocaleString()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {row.productInterest.map((p) => (
                      <Badge key={p} variant="outline" className="text-[10px]">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Select
                    value={row.status}
                    onValueChange={(value) =>
                      onStatusChange(row.id, value as RfqStatus)
                    }
                  >
                    <SelectTrigger className="h-9 min-w-[8rem] capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-4 font-sans text-xs text-ink-muted">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
