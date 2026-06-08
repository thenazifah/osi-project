"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCover } from "@/components/catalog/ProductCover";
import { CldMediaImage } from "@/components/visuals/CldMediaImage";
import type { ProductCategory } from "@/data/products";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  src: string;
  alt: string;
};

type ProductImageGalleryProps = {
  images: GalleryImage[];
  category: ProductCategory;
  className?: string;
};

export function ProductImageGallery({
  images,
  category,
  className,
}: ProductImageGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <ProductCover category={category} className={cn("rounded-none rounded-t-xl", className)} />
    );
  }

  const current = images[active];
  const hasMultiple = images.length > 1;

  const goPrev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="relative aspect-[4/3] w-full bg-tag-bg">
        <CldMediaImage
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 480px"
          className="object-cover"
        />
        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ink/50 text-white backdrop-blur-sm transition-colors hover:bg-ink/70"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ink/50 text-white backdrop-blur-sm transition-colors hover:bg-ink/70"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/60 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
              {active + 1} / {images.length}
            </span>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="grid grid-cols-4 gap-2 border-t border-border bg-surface p-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={image.alt}
              aria-current={active === index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border-2 transition-all duration-200",
                active === index
                  ? "border-accent ring-2 ring-accent/20"
                  : "border-border opacity-80 hover:border-accent/40 hover:opacity-100"
              )}
            >
              <CldMediaImage
                src={image.src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
