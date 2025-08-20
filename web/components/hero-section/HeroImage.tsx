"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface HeroImageProps extends ImageProps {
  className?: string;
}

export default function HeroImage({
  src,
  alt,
  className = "",
  ...props
}: HeroImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // fallback: blurred radial gradient if image fails
    return (
      <div
        className={`w-full h-full absolute left-0 top-0 bg-gradient-to-br from-green-700 via-black to-green-900 ${className}`}
        aria-label="Background fallback"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover object-top brightness-75 transition-all duration-500 ${className}`}
      priority
      onError={() => setHasError(true)}
      sizes="100vw"
      {...props}
    />
  );
}
