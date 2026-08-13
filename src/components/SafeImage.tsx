"use client";

import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
}

const DEFAULT_FALLBACK = 'https://dpptnkehkzolqrifbagx.supabase.co/storage/v1/object/public/projects/proj_1786597773542_article_bim_revit_mep_1786596972626.png';

export default function SafeImage({
  src,
  alt,
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
