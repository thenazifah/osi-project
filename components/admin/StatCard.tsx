import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className="border-border bg-surface">
      <CardContent className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-sea">
          {label}
        </p>
        <p className="mt-2 font-display text-3xl tabular-nums text-accent">
          {value}
        </p>
        {hint ? (
          <p className="mt-1 font-sans text-xs text-ink-muted">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
