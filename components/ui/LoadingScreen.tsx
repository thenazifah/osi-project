import { OsiLogo } from "@/components/brand/OsiLogo";
import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  className?: string;
  label?: string;
  /** Cover the full viewport (e.g. over nav during route changes). */
  fullscreen?: boolean;
};

export function LoadingScreen({
  className,
  label = "Loading",
  fullscreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-bg",
        fullscreen ? "fixed inset-0 z-[100]" : "min-h-screen w-full",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="osi-loading-logo">
        <OsiLogo size={80} priority />
      </div>
      <div
        className="mt-8 h-1 w-36 overflow-hidden rounded-full bg-tag-bg"
        aria-hidden
      >
        <div className="osi-loading-bar h-full rounded-full bg-accent-2" />
      </div>
      <p className="sr-only">{label}</p>
    </div>
  );
}
