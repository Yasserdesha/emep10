"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
}

export function ScrollRevealText({ text, className = "" }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const startOffset = windowHeight * 0.85;
      const endOffset = windowHeight * 0.15;
      
      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;
      
      const newProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = text.split(" ");
  
  return (
    <p
      ref={containerRef}
      className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-relaxed text-white tracking-tight ${className}`}
    >
      {words.map((word, index) => {
        const appearProgress = progress * (words.length + 1);
        const wordAppearProgress = Math.max(0, Math.min(1, appearProgress - index));
        const wordOpacity = Math.max(0.15, wordAppearProgress);
        const wordBlur = (1 - wordAppearProgress) * 16;
        
        return (
          <span
            key={index}
            className="inline-block transition-all duration-150 ease-out"
            style={{
              opacity: wordOpacity,
              filter: `blur(${wordBlur}px)`,
              transform: `translateY(${(1 - wordAppearProgress) * 8}px)`,
              marginRight: "0.28em",
              marginLeft: "0.28em",
            }}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
}

export default ScrollRevealText;
