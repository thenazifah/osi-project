"use client";

import { useMemo, useState } from "react";
import {
  ClipboardList,
  FileText,
  ImageIcon,
  LogIn,
  Package,
  RefreshCw,
  Search,
  Share2,
} from "lucide-react";
import type { AuditCategory, AuditLogEntry } from "@/lib/admin-types";
import { cn } from "@/lib/utils";

const CATEGORIES: { id: AuditCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "auth", label: "Auth" },
  { id: "rfq", label: "RFQ" },
  { id: "product", label: "Products" },
  { id: "content", label: "Content" },
  { id: "site", label: "Site" },
  { id: "sync", label: "Sync" },
  { id: "upload", label: "Uploads" },
];

const CATEGORY_STYLE: Record<AuditCategory, string> = {
  auth: "border-violet-200 bg-violet-50 text-violet-800",
  rfq: "border-sky-200 bg-sky-50 text-sky-800",
  product: "border-teal-200 bg-teal-50 text-teal-800",
  content: "border-indigo-200 bg-indigo-50 text-indigo-800",
  site: "border-amber-200 bg-amber-50 text-amber-900",
  sync: "border-emerald-200 bg-emerald-50 text-emerald-800",
  upload: "border-rose-200 bg-rose-50 text-rose-800",
};

function categoryIcon(category: AuditCategory) {
  switch (category) {
    case "auth":
      return LogIn;
    case "rfq":
      return FileText;
    case "product":
      return Package;
    case "content":
      return ClipboardList;
    case "site":
      return Share2;
    case "sync":
      return RefreshCw;
    case "upload":
      return ImageIcon;
  }
}

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function actorInitial(email: string): string {
  return (email.charAt(0) || "?").toUpperCase();
}

export function AuditLogViewer({ entries }: { entries: AuditLogEntry[] }) {
  const [category, setCategory] = useState<AuditCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (category !== "all" && entry.category !== category) return false;
      if (!q) return true;
      return (
        entry.summary.toLowerCase().includes(q) ||
        entry.actor.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q) ||
        (entry.targetLabel?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [entries, category, query]);

  const counts = useMemo(() => {
    const map = new Map<AuditCategory, number>();
    for (const entry of entries) {
      map.set(entry.category, (map.get(entry.category) ?? 0) + 1);
    }
    return map;
  }, [entries]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 font-sans text-xs font-medium transition-all duration-200",
                category === item.id
                  ? "border-accent bg-accent text-bg shadow-sm"
                  : "border-border/80 bg-surface/90 text-ink-muted hover:border-sea/30 hover:text-accent"
              )}
            >
              {item.label}
              {item.id !== "all" ? (
                <span className="ml-1.5 tabular-nums opacity-70">
                  {counts.get(item.id) ?? 0}
                </span>
              ) : (
                <span className="ml-1.5 tabular-nums opacity-70">
                  {entries.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <label className="relative block w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted/60" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs…"
            className="h-10 w-full rounded-xl border border-border/80 bg-surface/90 pl-10 pr-3 font-sans text-sm text-ink shadow-[inset_0_1px_2px_rgba(11,31,42,0.04)] transition-colors focus:border-accent-2/50 focus:outline-none focus:ring-2 focus:ring-accent-2/15"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-panel flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-bg/40 px-6 py-14 text-center">
          <ClipboardList className="h-9 w-9 text-ink-muted/35" strokeWidth={1.5} />
          <p className="font-sans text-sm text-ink-muted">
            {entries.length === 0
              ? "No audit events yet. Actions in the dashboard will appear here."
              : "No logs match your filters."}
          </p>
        </div>
      ) : (
        <div className="admin-panel overflow-hidden rounded-xl border border-border/80 bg-surface/90 shadow-[0_2px_12px_rgba(11,31,42,0.04)]">
          <ul className="divide-y divide-border/60">
            {filtered.map((entry) => {
              const Icon = categoryIcon(entry.category);
              return (
                <li
                  key={entry.id}
                  className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-bg/40 sm:flex-row sm:items-start sm:gap-4 sm:px-5"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                        CATEGORY_STYLE[entry.category]
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans text-sm leading-snug text-ink">
                        {entry.summary}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-ink-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] text-accent">
                            {actorInitial(entry.actor)}
                          </span>
                          {entry.actor}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted/70">
                          {entry.action}
                        </span>
                        {entry.targetLabel ? (
                          <span className="truncate">{entry.targetLabel}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                        CATEGORY_STYLE[entry.category]
                      )}
                    >
                      {entry.category}
                    </span>
                    <time
                      className="font-sans text-xs tabular-nums text-ink-muted"
                      dateTime={entry.createdAt ?? undefined}
                      title={
                        entry.createdAt
                          ? new Date(entry.createdAt).toLocaleString()
                          : undefined
                      }
                    >
                      {formatWhen(entry.createdAt)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
