import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border font-mono text-[10px] uppercase tracking-wider transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent-2 px-2.5 py-0.5 text-bg",
        secondary: "border-border bg-tag-bg px-2.5 py-0.5 text-accent",
        outline: "border-border bg-surface px-2.5 py-0.5 text-ink-muted",
        export: "border-export/40 bg-export/10 px-2.5 py-0.5 text-accent",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
