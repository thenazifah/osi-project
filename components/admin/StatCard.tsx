import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
};

export function StatCard({ label, value, hint, href }: StatCardProps) {
  const inner = (
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
      {href ? (
        <p className="mt-3 flex items-center gap-1 font-sans text-xs font-medium text-sea">
          Open
          <ArrowRight className="h-3 w-3" />
        </p>
      ) : null}
    </CardContent>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <Card className="card-interactive border-border bg-surface transition-shadow hover:shadow-md">
          {inner}
        </Card>
      </Link>
    );
  }

  return <Card className="border-border bg-surface">{inner}</Card>;
}
