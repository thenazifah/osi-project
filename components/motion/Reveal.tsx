import { cn } from "@/lib/utils";

type RevealProps = {
  visible: boolean;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
  children: React.ReactNode;
};

const directionClass = {
  up: "reveal-up",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
} as const;

export function Reveal({
  visible,
  className,
  direction = "up",
  children,
}: RevealProps) {
  return (
    <div
      className={cn(
        directionClass[direction],
        visible && "is-revealed",
        className
      )}
    >
      {children}
    </div>
  );
}
