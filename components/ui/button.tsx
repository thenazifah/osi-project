import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-accent-2 text-bg shadow-[0_2px_12px_rgba(27,138,138,0.35)] hover:bg-sea-light hover:shadow-[0_4px_16px_rgba(27,138,138,0.4)] active:scale-[0.98]",
        cta:
          "bg-cta text-bg shadow-[0_2px_12px_rgba(12,48,72,0.3)] hover:bg-cta-hover hover:shadow-[0_4px_16px_rgba(12,48,72,0.4)] active:scale-[0.98]",
        primary:
          "bg-accent text-bg shadow-[0_2px_12px_rgba(14,58,91,0.25)] hover:bg-ink hover:shadow-[0_4px_16px_rgba(11,31,42,0.3)] active:scale-[0.98]",
        outline:
          "border-2 border-border bg-surface text-accent hover:border-accent/40 hover:bg-tag-bg active:scale-[0.98]",
        ghost:
          "bg-transparent text-ink-muted hover:bg-tag-bg hover:text-accent",
        nav: "bg-white text-accent shadow-[0_2px_12px_rgba(11,31,42,0.12)] hover:bg-white/90 hover:shadow-[0_4px_16px_rgba(11,31,42,0.18)] active:scale-[0.98]",
        footer:
          "bg-bg text-accent shadow-lg hover:bg-white hover:shadow-xl active:scale-[0.98]",
        compliance:
          "border border-bg/40 bg-transparent text-bg hover:border-sea-light hover:bg-white/10",
      },
      size: {
        default: "h-11 px-6 text-sm",
        sm: "h-9 px-4 text-xs",
        nav: "h-10 px-5 text-[13px]",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
