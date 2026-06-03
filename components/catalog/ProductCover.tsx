import type { ProductCategory } from "@/data/products";
import { cn } from "@/lib/utils";

const PALETTES: Record<
  ProductCategory,
  { base: string; mid: string; accent: string; label: string }
> = {
  tilapia: {
    base: "#E8F2F4",
    mid: "#1B8A8A",
    accent: "#0E3A5B",
    label: "TIL",
  },
  carp: {
    base: "#EDF0EB",
    mid: "#4A6741",
    accent: "#2C3E2D",
    label: "CRP",
  },
  marine: {
    base: "#E6EEF5",
    mid: "#2A6F97",
    accent: "#0B1F2A",
    label: "MAR",
  },
  custom: {
    base: "#F0EDE8",
    mid: "#8A7355",
    accent: "#3D3428",
    label: "CST",
  },
};

type ProductCoverProps = {
  category: ProductCategory;
  className?: string;
};

export function ProductCover({ category, className }: ProductCoverProps) {
  const palette = PALETTES[category];

  return (
    <div
      className={cn(
        "relative flex aspect-video w-full items-end justify-between overflow-hidden rounded-t-lg border-b border-border p-4",
        className
      )}
      style={{ backgroundColor: palette.base }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 225"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <pattern
            id={`scale-${category}`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(35)"
          >
            <path
              d="M0 12 Q6 4 12 12 Q18 20 24 12"
              fill="none"
              stroke={palette.mid}
              strokeWidth="0.75"
              opacity="0.35"
            />
          </pattern>
        </defs>
        <rect width="400" height="225" fill={`url(#scale-${category})`} />
        <path
          d="M0 180 Q100 150 200 170 T400 155 L400 225 L0 225 Z"
          fill={palette.mid}
          fillOpacity="0.15"
        />
        <path
          d="M0 195 Q120 175 240 188 T400 178 L400 225 L0 225 Z"
          fill={palette.accent}
          fillOpacity="0.08"
        />
        <line
          x1="0"
          y1="60"
          x2="400"
          y2="120"
          stroke={palette.accent}
          strokeWidth="0.5"
          opacity="0.2"
        />
        <line
          x1="0"
          y1="90"
          x2="400"
          y2="150"
          stroke={palette.mid}
          strokeWidth="0.5"
          opacity="0.25"
        />
      </svg>
      <span
        className="relative font-mono text-[10px] tracking-[0.2em] text-ink/40"
        style={{ color: palette.accent }}
      >
        EXPORT GRADE
      </span>
      <span
        className="relative font-mono text-xs font-medium tracking-widest opacity-70"
        style={{ color: palette.accent }}
      >
        {palette.label}
      </span>
    </div>
  );
}
