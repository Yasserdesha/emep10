"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealTextProps {
  text?: string;
  className?: string;
  id?: string;
  as?: "h2" | "p" | "div";
}

export function ScrollRevealText({ 
  text = "", 
  className = "", 
  id,
  as: Component = "p" 
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;
      
      const startOffset = windowHeight * 0.95;
      const endOffset = windowHeight * 0.1;
      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;
      
      const newProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
      setProgress(newProgress);
    };

    // Immediately check on mount in case element is already in view
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const safeText = typeof text === "string" ? text.trim() : "";
  // Split on spaces, filter empty strings
  const words = safeText ? safeText.split(/\s+/).filter(Boolean) : [];

  // SSR / not mounted: render plain text so it's readable immediately
  if (!mounted || words.length === 0) {
    return (
      <Component 
        ref={containerRef as any} 
        id={id}
        className={`font-bold leading-relaxed text-white tracking-tight ${className}`}
        style={{ opacity: 1 }}
      >
        {safeText}
      </Component>
    );
  }
  
  return (
    <Component
      ref={containerRef as any}
      id={id}
      className={`font-bold leading-relaxed text-white tracking-tight ${className}`}
      // Ensure words wrap naturally and symmetrically regardless of LTR/RTL on mobile
      style={{ wordBreak: "break-word", overflowWrap: "break-word", textWrap: "balance" as any }}
    >
      {words.map((word, index) => {
        const totalWords = words.length;
        // Each word reveals when scroll progress passes its threshold
        const wordThreshold = index / totalWords;
        const wordAppearProgress = Math.max(
          0,
          Math.min(1, (progress - wordThreshold) / (1 / totalWords))
        );

        // Minimum opacity 0.25 so text is ALWAYS readable even without scroll
        const wordOpacity = progress === 0 ? 1 : Math.max(0.25, wordAppearProgress);
        const wordBlur = progress === 0 ? 0 : (1 - wordAppearProgress) * 10;
        const wordY = progress === 0 ? 0 : (1 - wordAppearProgress) * 5;
        
        return (
          <React.Fragment key={index}>
            <span
              className="inline-block transition-all duration-200 ease-out"
              style={{
                opacity: wordOpacity,
                filter: wordBlur > 0.1 ? `blur(${wordBlur}px)` : "none",
                transform: wordY > 0.1 ? `translateY(${wordY}px)` : "none",
                willChange: "opacity, filter, transform",
              }}
            >
              {word}
            </span>
            {/* Always render a real space between words */}
            {index < words.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </Component>
  );
}

export default ScrollRevealText;
