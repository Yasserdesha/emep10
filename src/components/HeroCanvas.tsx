"use client";

import React, { useRef, useEffect } from 'react';

const TOTAL_FRAMES = 35;

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const stateRef = useRef({
    currentFrameIndex: 0,
    targetFrameIndex: 0,
    isAnimating: false,
  });

  const getFramePath = (index: number) => {
    const paddedIndex = String(index + 1).padStart(3, '0');
    return `/Animated background images/compressed/frame-${paddedIndex}.webp`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let isSubscribed = true;

    const renderFrame = (index: number) => {
      if (!ctx || !canvas || !isSubscribed) return;
      const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
      const img = images[safeIndex];

      if (!img || !img.complete || img.naturalWidth === 0) {
        // Fallback to closest loaded frame
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = images[Math.max(0, safeIndex - offset)];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            drawImg(prev);
            return;
          }
          const next = images[Math.min(TOTAL_FRAMES - 1, safeIndex + offset)];
          if (next && next.complete && next.naturalWidth > 0) {
            drawImg(next);
            return;
          }
        }
        return;
      }

      drawImg(img);
    };

    const drawImg = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const nx = (cw - nw) / 2;
      const ny = (ch - nh) / 2;

      ctx.drawImage(img, nx, ny, nw, nh);
    };

    // 1. Immediate parallel preloading of all 35 lightweight WebP frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (!isSubscribed) return;
        if (i === 0 && stateRef.current.currentFrameIndex === 0) {
          renderFrame(0);
        }
      };
      images[i] = img;
    }

    imagesRef.current = images;

    // 2. Responsive Canvas Sizing with DPR cap for 60fps performance
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      renderFrame(stateRef.current.currentFrameIndex);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // 3. Ultra-smooth On-Demand Render Loop
    let animId = 0;
    const animate = () => {
      if (!isSubscribed) return;
      const diff = stateRef.current.targetFrameIndex - stateRef.current.currentFrameIndex;
      if (Math.abs(diff) > 0.02) {
        stateRef.current.currentFrameIndex += diff * 0.25;
        renderFrame(stateRef.current.currentFrameIndex);
        animId = requestAnimationFrame(animate);
      } else {
        stateRef.current.currentFrameIndex = stateRef.current.targetFrameIndex;
        renderFrame(stateRef.current.currentFrameIndex);
        stateRef.current.isAnimating = false;
      }
    };

    const triggerAnimation = () => {
      if (!stateRef.current.isAnimating) {
        stateRef.current.isAnimating = true;
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(animate);
      }
    };

    // 4. Scroll Progress Listener for Mobile & Desktop
    const handleScroll = () => {
      const track = document.getElementById('heroTrack');
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance > 0) {
        const scrolledDistance = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolledDistance / totalScrollableDistance));
        const nextTarget = Math.min(TOTAL_FRAMES - 1, Math.round(progress * (TOTAL_FRAMES - 1)));

        if (nextTarget !== stateRef.current.targetFrameIndex) {
          stateRef.current.targetFrameIndex = nextTarget;
          triggerAnimation();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 5. Reset Event Listener
    const handleReset = () => {
      stateRef.current.targetFrameIndex = 0;
      stateRef.current.currentFrameIndex = 0;
      renderFrame(0);
    };
    window.addEventListener('resetHeroCanvas', handleReset);

    // Cleanup
    return () => {
      isSubscribed = false;
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resetHeroCanvas', handleReset);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} id="heroCanvas"></canvas>
      <div className="canvas-overlay"></div>
    </div>
  );
}
