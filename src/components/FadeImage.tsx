"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

export interface FadeImageProps extends Omit<ImageProps, "onLoad"> {
  fadeDelay?: number;
  containerClassName?: string;
}

export function FadeImage({ 
  className = "", 
  containerClassName = "",
  fadeDelay = 0, 
  alt = "E-MEP",
  src,
  ...props 
}: FadeImageProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<any>(src);
  const [hasError, setHasError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, fadeDelay);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "100px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [fadeDelay]);

  if (!imgSrc) {
    return null;
  }

  const isFill = Boolean(props.fill);

  return (
    <div 
      ref={ref} 
      className={`${isFill ? 'relative h-full w-full' : 'relative inline-block'} overflow-hidden ${containerClassName}`}
    >
      <Image
        alt={alt}
        src={hasError ? '/assets/projects/portfolio-2_page-0004.jpg' : imgSrc}
        {...props}
        className={`${className} transition-all duration-700 ease-out ${
          isVisible && isLoaded ? "opacity-100 scale-100" : "opacity-90 scale-[1.01]"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImgSrc('/assets/projects/portfolio-2_page-0004.jpg');
          }
        }}
      />
    </div>
  );
}

export default FadeImage;
