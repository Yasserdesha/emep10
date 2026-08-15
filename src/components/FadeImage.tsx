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
  ...props 
}: FadeImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [fadeDelay]);

  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${containerClassName}`}>
      <Image
        alt={alt}
        {...props}
        className={`${className} transition-all duration-700 ease-out ${
          isVisible && isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export default FadeImage;
