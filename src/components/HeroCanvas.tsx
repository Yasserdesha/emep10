"use client";

import React, { useRef, useEffect } from 'react';

const TOTAL_FRAMES = 185;

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
    return `/Animated background images/ezgif-frame-${paddedIndex}.jpg`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let isSubscribed = true;

    const renderFrame = (index: number) => {
      if (!ctx || !canvas || !isSubscribed) return;
      const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
      const img = images[safeIndex];

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const nx = (cw - nw) / 2;
      const ny = (ch - nh) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, nx, ny, nw, nh);
    };

    // 1. Load First Frame IMMEDIATELY for Instant FCP & LCP
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      if (isSubscribed) {
        renderFrame(0);
      }
    };

    // 2. Ultra-fast background batch preloading for instant background animation response
    const loadRemainingFrames = () => {
      let currentIndex = 1;
      const BATCH_SIZE = 30;

      const loadNextBatch = () => {
        if (!isSubscribed || currentIndex >= TOTAL_FRAMES) return;
        const endIndex = Math.min(TOTAL_FRAMES, currentIndex + BATCH_SIZE);

        for (let i = currentIndex; i < endIndex; i++) {
          const img = new Image();
          img.src = getFramePath(i);
          images[i] = img;
        }

        currentIndex = endIndex;
        if (currentIndex < TOTAL_FRAMES && isSubscribed) {
          setTimeout(loadNextBatch, 10);
        }
      };

      setTimeout(loadNextBatch, 10);
    };

    // 2. Load remaining frames immediately in background batches for instant smooth scrolling
    loadRemainingFrames();
    imagesRef.current = images;

    // 3. Responsive Canvas Sizing
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      renderFrame(stateRef.current.currentFrameIndex);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // 4. On-Demand Render Loop (only active during scroll changes to eliminate CPU waste)
    let animId = 0;
    const animate = () => {
      if (!isSubscribed) return;
      const diff = stateRef.current.targetFrameIndex - stateRef.current.currentFrameIndex;
      if (Math.abs(diff) > 0.01) {
        stateRef.current.currentFrameIndex += diff * 0.18;
        renderFrame(stateRef.current.currentFrameIndex);
        animId = requestAnimationFrame(animate);
      } else {
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

    // 5. Scroll Progress Listener
    const handleScroll = () => {
      const track = document.getElementById('heroTrack');
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance > 0) {
        const scrolledDistance = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolledDistance / totalScrollableDistance));
        const nextTarget = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));

        if (nextTarget !== stateRef.current.targetFrameIndex) {
          stateRef.current.targetFrameIndex = nextTarget;
          triggerAnimation();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Reset Event Listener
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
