import { cn } from "@/lib/utils";

const FLAG_BY_LOCALE: Record<string, { label: string }> = {
  en: { label: "English" },
  ja: { label: "Japanese" },
  zh: { label: "Chinese" },
};

const SIZES = {
  sm: "h-4 w-6",
  md: "h-5 w-7",
  lg: "h-6 w-9",
} as const;

type LocaleFlagProps = {
  locale: string;
  size?: keyof typeof SIZES;
  className?: string;
  label?: string;
};

export function getLocaleFlagLabel(locale: string): string {
  return FLAG_BY_LOCALE[locale]?.label ?? locale;
}

function GbFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} aria-hidden>
      <clipPath id="gb-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="gb-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#gb-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 60,30 M60,0 0,30"
          stroke="#C8102E"
          strokeWidth="4"
          clipPath="url(#gb-t)"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

function JpFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 600" className={className} aria-hidden>
      <rect width="900" height="600" fill="#fff" />
      <circle cx="450" cy="300" r="180" fill="#bc002d" />
    </svg>
  );
}

function CnFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 600" className={className} aria-hidden>
      <rect width="900" height="600" fill="#de2910" />
      <polygon
        fill="#ffde00"
        points="150,150 165,210 228,210 177,247 195,307 150,270 105,307 123,247 72,210 135,210"
      />
      <polygon
        fill="#ffde00"
        points="300,90 306,108 325,108 310,119 316,137 300,126 284,137 290,119 275,108 294,108"
      />
      <polygon
        fill="#ffde00"
        points="360,150 366,168 385,168 370,179 376,197 360,186 344,197 350,179 335,168 354,168"
      />
      <polygon
        fill="#ffde00"
        points="360,240 366,258 385,258 370,269 376,287 360,276 344,287 350,269 335,258 354,258"
      />
      <polygon
        fill="#ffde00"
        points="300,300 306,318 325,318 310,329 316,347 300,336 284,347 290,329 275,318 294,318"
      />
    </svg>
  );
}

const FLAG_ICONS: Record<string, React.FC<{ className?: string }>> = {
  en: GbFlag,
  ja: JpFlag,
  zh: CnFlag,
};

export function LocaleFlag({
  locale,
  size = "md",
  className,
  label,
}: LocaleFlagProps) {
  const Flag = FLAG_ICONS[locale] ?? GbFlag;
  const ariaLabel = label ?? getLocaleFlagLabel(locale);

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "inline-flex shrink-0 overflow-hidden rounded-[3px] border border-black/15 bg-white shadow-sm",
        SIZES[size],
        className
      )}
    >
      <Flag className="h-full w-full object-cover" />
    </span>
  );
}
