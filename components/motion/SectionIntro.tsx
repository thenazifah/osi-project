import { cn } from "@/lib/utils";

type SectionIntroProps = {
  visible: boolean;
  className?: string;
  children: React.ReactNode;
};

export function SectionIntro({ visible, className, children }: SectionIntroProps) {
  return (
    <div className={cn("section-intro", visible && "section-intro-visible", className)}>
      {children}
    </div>
  );
}

export function SectionIntroItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("section-intro-item", className)}>{children}</div>;
}
