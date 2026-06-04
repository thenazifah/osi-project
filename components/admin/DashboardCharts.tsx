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

type DashboardChartsProps = {
  data: DashboardChartData;
};

function hasData(rows: { count: number }[]) {
  return rows.some((r) => r.count > 0);
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
      <ChartCard title="RFQ by status" subtitle="Pipeline breakdown">
        {hasData(rfqStatus) ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rfqStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5d4dc" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#0c3048" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <EmptyChart message="No RFQ data yet." />
        )}
      </ChartCard>

      <ChartCard title="RFQ by month" subtitle="Last 6 months">
        {hasData(rfqMonth) ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rfqMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5d4dc" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#1b8a8a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <EmptyChart message="No monthly RFQ history yet." />
        )}
      </ChartCard>

      <ChartCard title="Products by category" subtitle="Catalog mix">
        {hasData(products) ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={products}>
            <CartesianGrid strokeDasharray="3 3" stroke="#c5d4dc" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#2a6f97" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <EmptyChart message="Import products to see category breakdown." />
        )}
      </ChartCard>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <p className="flex h-[220px] items-center justify-center px-4 text-center font-sans text-sm text-ink-muted">
      {message}
    </p>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border bg-surface">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="font-sans text-xs text-ink-muted">{subtitle}</p>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
