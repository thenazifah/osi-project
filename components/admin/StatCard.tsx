import Link from "next/link";
import { Activity, ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatTone = "sea" | "teal" | "ink" | "gold" | "nav" | "alert";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  icon?: LucideIcon;
  tone?: StatTone;
  delayIndex?: number;
};

export function StatCard({
  label,
  value,
  hint,
  href,
  icon: Icon = Activity,
  tone = "sea",
  delayIndex = 0,
}: StatCardProps) {
  const delayClass =
    delayIndex > 0
      ? `admin-dashboard-enter admin-dashboard-enter-${Math.min(delayIndex, 8)}`
      : "admin-dashboard-enter admin-dashboard-enter-2";

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={cn("admin-stat-icon", `admin-stat-icon-${tone}`)}>
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        {href ? (
          <ArrowRight className="h-4 w-4 text-ink-muted/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-sea" />
        ) : null}
      </div>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl tabular-nums text-ink">{value}</p>
      {hint ? (
        <p className="mt-1 font-sans text-xs text-ink-muted">{hint}</p>
      ) : null}
    </>
  );

  const className = cn(
    "admin-stat-card group block rounded-xl border border-border/80 bg-surface/90 p-5 shadow-[0_2px_12px_rgba(11,31,42,0.04)] backdrop-blur-sm transition-all duration-250",
    href && "hover:-translate-y-0.5 hover:border-sea/30 hover:shadow-[0_8px_24px_rgba(11,31,42,0.08)]",
    delayClass
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
