"use client";

import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  onClick?: () => void;
}

const DEFAULT_FALLBACK = '/assets/projects/portfolio-2_page-0004.jpg';

export default function SafeImage({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
  onClick,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
