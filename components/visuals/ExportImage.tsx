import Image from "next/image";
import { cn } from "@/lib/utils";

type ExportImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  overlay?: "sea" | "dark" | "light" | "none";
  objectPosition?: string;
  sizes?: string;
};

const overlayStyles = {
  sea: "from-accent/80 via-accent/25 to-transparent",
  dark: "from-ink/75 via-ink/30 to-transparent",
  light: "from-bg/90 via-bg/40 to-transparent",
  none: "",
};

export function ExportImage({
  src,
  alt,
  priority = false,
  className,
  imageClassName,
  overlay = "sea",
  objectPosition = "center",
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: ExportImageProps) {
  return (
    <div
      className={cn(
        "export-image-frame relative overflow-hidden bg-tag-bg",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover transition-transform duration-500", imageClassName)}
        style={{ objectPosition }}
      />
      {overlay !== "none" && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t",
            overlayStyles[overlay]
          )}
          aria-hidden
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
        aria-hidden
      />
    </div>
  );
}
