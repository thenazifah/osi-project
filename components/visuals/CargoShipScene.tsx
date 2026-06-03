import { cn } from "@/lib/utils";

type CargoShipSceneProps = {
  className?: string;
};

/** Branded maritime illustration — cargo vessel at sea */
export function CargoShipScene({ className }: CargoShipSceneProps) {
  return (
    <svg
      viewBox="0 0 560 640"
      className={cn("h-full w-full", className)}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f2f4" />
          <stop offset="55%" stopColor="#c5dce8" />
          <stop offset="100%" stopColor="#8eb4c9" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a6f97" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0e3a5b" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="hull" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0e3a5b" />
          <stop offset="100%" stopColor="#0b1f2a" />
        </linearGradient>
        <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b8a8a" />
          <stop offset="100%" stopColor="#0e3a5b" />
        </linearGradient>
      </defs>

      <rect width="560" height="640" fill="url(#sky)" />
      <circle cx="420" cy="120" r="48" fill="#f4f7f9" fillOpacity="0.85" />
      <circle cx="420" cy="120" r="38" fill="#e8eff3" fillOpacity="0.5" />

      <path
        d="M0 380 Q80 360 160 372 T320 365 T480 378 L560 385 L560 640 L0 640 Z"
        fill="url(#water)"
      />
      <path
        d="M0 400 Q140 385 280 395 T560 402 L560 640 L0 640 Z"
        fill="#1b8a8a"
        fillOpacity="0.12"
      />

      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={`M${-20 + i * 100} 410 Q${40 + i * 100} 400 ${100 + i * 100} 410`}
          stroke="#3db8b0"
          strokeWidth="1.5"
          strokeOpacity={0.25 + (i % 2) * 0.15}
        />
      ))}

      {/* Hull */}
      <path
        d="M80 340 L120 320 L440 320 L500 340 L480 400 L100 400 Z"
        fill="url(#hull)"
      />
      <path d="M100 400 L480 400 L460 420 L120 420 Z" fill="#0b1f2a" fillOpacity="0.4" />

      {/* Containers on deck */}
      {[0, 1, 2, 3, 4, 5].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={`${col}-${row}`}
            x={140 + col * 48}
            y={260 - row * 22}
            width="40"
            height="18"
            rx="1"
            fill={row === 0 ? "#1b8a8a" : row === 1 ? "#2a6f97" : "#0e3a5b"}
            fillOpacity={0.85 - row * 0.12}
            stroke="#e8f2f4"
            strokeWidth="0.5"
            strokeOpacity="0.35"
          />
        ))
      )}

      {/* Bridge */}
      <rect x="380" y="248" width="72" height="72" rx="2" fill="url(#deck)" />
      <rect x="392" y="260" width="20" height="14" fill="#3db8b0" fillOpacity="0.5" />
      <rect x="418" y="260" width="20" height="14" fill="#3db8b0" fillOpacity="0.35" />
      <rect x="430" y="220" width="8" height="28" fill="#0b1f2a" />
      <path d="M434 200 L438 220 L430 220 Z" fill="#c4a35a" />

      {/* Wake */}
      <ellipse cx="90" cy="410" rx="60" ry="8" fill="#3db8b0" fillOpacity="0.2" />
      <ellipse cx="130" cy="418" rx="40" ry="5" fill="#3db8b0" fillOpacity="0.15" />

      {/* Horizon grid accent */}
      <path
        d="M0 320 L560 320"
        stroke="#0e3a5b"
        strokeOpacity="0.15"
        strokeWidth="1"
        strokeDasharray="4 8"
      />
    </svg>
  );
}
