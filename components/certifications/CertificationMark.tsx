import Image from "next/image";
import type { ReactNode } from "react";
import {
  CERTIFICATION_LOGOS,
  type CertificationLogoId,
} from "@/data/certification-images";
import { cn } from "@/lib/utils";

export type CertId =
  | "bsti"
  | "iso9001"
  | "tradeLicense"
  | "exportLicense"
  | "irc"
  | "environmental";

type CertificationMarkProps = {
  id: CertId;
  className?: string;
  alt?: string;
};

function isLogoCertId(id: CertId): id is CertificationLogoId {
  return id === "bsti" || id === "iso9001";
}

export function CertificationMark({ id, className, alt }: CertificationMarkProps) {
  if (isLogoCertId(id)) {
    const src = CERTIFICATION_LOGOS[id];
    const isBsti = id === "bsti";
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <Image
          src={src}
          alt={alt ?? `${id} certification logo`}
          width={isBsti ? 140 : 160}
          height={isBsti ? 140 : 160}
          className={cn(
            "w-auto object-contain",
            isBsti ? "h-24" : "h-24 mix-blend-multiply"
          )}
          priority={isBsti}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)} aria-hidden>
      {SVG_MARKS[id]}
    </div>
  );
}

const SVG_MARKS: Record<Exclude<CertId, CertificationLogoId>, ReactNode> = {
  tradeLicense: (
    <svg viewBox="0 0 120 48" className="h-12 w-auto" fill="none">
      <rect x="2" y="6" width="44" height="36" rx="4" fill="#0e3a5b" />
      <path
        d="M12 18h24M12 24h18M12 30h22"
        stroke="#3db8b0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="36" cy="14" r="6" fill="#c4a35a" />
      <text
        x="54"
        y="22"
        fill="#0e3a5b"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        TRADE
      </text>
      <text
        x="54"
        y="34"
        fill="#64748b"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
      >
        Dhaka City Corp.
      </text>
    </svg>
  ),
  exportLicense: (
    <svg viewBox="0 0 120 48" className="h-12 w-auto" fill="none">
      <rect x="2" y="6" width="44" height="36" rx="4" fill="#1b8a8a" />
      <path d="M14 28l8-10 6 6 10-14 8 18H14z" fill="#fff" fillOpacity="0.9" />
      <text
        x="54"
        y="20"
        fill="#0e3a5b"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        EXPORT
      </text>
      <text
        x="54"
        y="32"
        fill="#64748b"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
      >
        Ministry of Commerce
      </text>
    </svg>
  ),
  irc: (
    <svg viewBox="0 0 120 48" className="h-12 w-auto" fill="none">
      <rect x="2" y="6" width="44" height="36" rx="4" fill="#2a6f97" />
      <text
        x="24"
        y="28"
        textAnchor="middle"
        fill="#fff"
        fontSize="10"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        IRC
      </text>
      <text
        x="54"
        y="20"
        fill="#0e3a5b"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        IRC CERT.
      </text>
      <text
        x="54"
        y="32"
        fill="#64748b"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
      >
        National Board of Revenue
      </text>
    </svg>
  ),
  environmental: (
    <svg viewBox="0 0 120 48" className="h-12 w-auto" fill="none">
      <circle cx="24" cy="24" r="22" fill="#0d7a3a" />
      <path
        d="M24 10c-6 8-10 12-10 16a10 10 0 1020 0c0-4-4-8-10-16z"
        fill="#fff"
        fillOpacity="0.9"
      />
      <text
        x="54"
        y="20"
        fill="#0d7a3a"
        fontSize="9"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        ENVIRONMENT
      </text>
      <text
        x="54"
        y="32"
        fill="#64748b"
        fontSize="7"
        fontFamily="system-ui, sans-serif"
      >
        Dept. of Environment
      </text>
    </svg>
  ),
};
