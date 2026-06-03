import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/osi-logo.png";

type OsiLogoProps = {
  className?: string;
  /** Display height in px; width scales with the image aspect ratio */
  size?: number;
  priority?: boolean;
};

export function OsiLogo({
  className,
  size = 40,
  priority = false,
}: OsiLogoProps) {
  return (
    <div className={cn("flex shrink-0 items-center", className)}>
      <Image
        src={LOGO_SRC}
        alt="Organic Scales International"
        width={size}
        height={size}
        priority={priority}
        className="h-auto w-auto max-w-none object-contain"
        style={{ width: size, height: "auto" }}
      />
    </div>
  );
}
