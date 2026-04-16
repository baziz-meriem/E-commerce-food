"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/** Verified Unsplash URL — used if primary fails or is missing */
export const FOOD_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85";

type Props = {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * Food/product image with guaranteed display: invalid URLs fall back to a working stock photo.
 */
export function FoodImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
}: Props) {
  const initial =
    src && src.startsWith("http") ? src : FOOD_IMAGE_FALLBACK;
  const [url, setUrl] = useState(initial);

  useEffect(() => {
    setUrl(src && src.startsWith("http") ? src : FOOD_IMAGE_FALLBACK);
  }, [src]);

  return (
    <Image
      src={url}
      alt={alt || "منتج غذائي"}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={85}
      onError={() => {
        if (url !== FOOD_IMAGE_FALLBACK) setUrl(FOOD_IMAGE_FALLBACK);
      }}
    />
  );
}
