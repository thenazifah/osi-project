"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardChartData } from "@/lib/admin-types";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  quoted: "Quoted",
  closed: "Closed",
};

const CATEGORY_LABELS: Record<string, string> = {
  tilapia: "Tilapia",
  carp: "Carp",
  marine: "Marine",
  custom: "Custom",
};

const CHART_COLORS = {
  ink: "#0c3048",
  teal: "#1b8a8a",
  sea: "#2a6f97",
};

type DashboardChartsProps = {
  data: DashboardChartData;
};

function hasData(rows: { count: number }[]) {
  return rows.some((r) => r.count > 0);
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-lg">
      <p className="font-sans text-xs text-ink-muted">{label}</p>
      <p className="font-display text-lg tabular-nums text-ink">{payload[0]?.value}</p>
    </div>
  );
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const rfqStatus = data.rfqByStatus.map((row) => ({
    ...row,
    label: STATUS_LABELS[row.status] ?? row.status,
  }));

  const rfqMonth = data.rfqByMonth.map((row) => ({
    ...row,
    label: row.month,
  }));

  const products = data.productsByCategory.map((row) => ({
    ...row,
    label: CATEGORY_LABELS[row.category] ?? row.category,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <ChartCard
        title="RFQ by status"
        subtitle="Pipeline breakdown"
        delayIndex={3}
        emptyMessage="No RFQ data yet."
        hasContent={hasData(rfqStatus)}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rfqStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(197,212,220,0.6)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5a6f7d" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#5a6f7d" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(27,138,138,0.06)" }} />
            <Bar dataKey="count" fill={CHART_COLORS.ink} radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="RFQ by month"
        subtitle="Last 6 months"
        delayIndex={4}
        emptyMessage="No monthly RFQ history yet."
        hasContent={hasData(rfqMonth)}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rfqMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(197,212,220,0.6)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#5a6f7d" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#5a6f7d" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(27,138,138,0.06)" }} />
            <Bar dataKey="count" fill={CHART_COLORS.teal} radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Products by category"
        subtitle="Catalog mix"
        delayIndex={5}
        emptyMessage="Import products to see category breakdown."
        hasContent={hasData(products)}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={products}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(197,212,220,0.6)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5a6f7d" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#5a6f7d" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(27,138,138,0.06)" }} />
            <Bar dataKey="count" fill={CHART_COLORS.sea} radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  delayIndex,
  emptyMessage,
  hasContent,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  delayIndex: number;
  emptyMessage: string;
  hasContent: boolean;
}) {
  return (
    <Card
      className={`admin-panel admin-dashboard-enter admin-dashboard-enter-${delayIndex} border-border/80 bg-surface/90 shadow-[0_2px_12px_rgba(11,31,42,0.04)] backdrop-blur-sm`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="font-sans text-xs text-ink-muted">{subtitle}</p>
      </CardHeader>
      <CardContent className="pt-0">
        {hasContent ? (
          children
        ) : (
          <div className="flex h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-bg/40 px-4 text-center">
            <BarChart3 className="h-7 w-7 text-ink-muted/35" strokeWidth={1.5} />
            <p className="font-sans text-sm text-ink-muted">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
