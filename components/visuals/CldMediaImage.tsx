"use client";

import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { isCloudinarySource } from "@/lib/cloudinary-image";

type CldMediaImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function CldMediaImage({
  src,
  alt,
  width = 800,
  height = 600,
  fill,
  sizes,
  className,
  priority,
}: CldMediaImageProps) {
  if (isCloudinarySource(src)) {
    if (fill) {
      return (
        <CldImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={className}
          priority={priority}
        />
      );
    }

    return (
      <CldImage
        src={src}
        width={width}
        height={height}
        alt={alt}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
