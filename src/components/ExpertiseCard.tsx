"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from './LanguageContext';

// Global cache to avoid double fetching of video blobs
const blobCache = new Map<string, string>();

async function getProtectedBlobUrl(datUrl: string): Promise<string | null> {
  if (blobCache.has(datUrl)) {
    return blobCache.get(datUrl)!;
  }
  try {
    const res = await fetch(datUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: 'video/mp4' });
    const blobUrl = URL.createObjectURL(blob);
    blobCache.set(datUrl, blobUrl);
    return blobUrl;
  } catch (err) {
    console.warn(`[E-MEP Engine] Failed to fetch dat asset ${datUrl}:`, err);
    return null;
  }
}

interface ExpertiseCardProps {
  img: string;
  datSrc: string;
  titleKey: string;
  descKey: string;
  onLearnMore?: () => void;
}

export default function ExpertiseCard({ img, datSrc, titleKey, descKey }: ExpertiseCardProps) {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animIdRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const prepareVideo = useCallback(async (): Promise<HTMLVideoElement | null> => {
    if (videoRef.current) return videoRef.current;
    
    const blobUrl = await getProtectedBlobUrl(datSrc);
    if (!blobUrl) return null;

    const video = document.createElement('video');
    video.src = blobUrl;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    
    videoRef.current = video;
    return video;
  }, [datSrc]);

  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!video || !canvas || !card) return;

    if (!video.paused && !video.ended) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const mediaContainer = card.querySelector('.expertise-media');
      const cw = mediaContainer ? mediaContainer.clientWidth : 600;
      const ch = mediaContainer ? mediaContainer.clientHeight : 400;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetW = Math.round(cw * dpr);
      const targetH = Math.round(ch * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const vw = video.videoWidth || cw;
      const vh = video.videoHeight || ch;

      if (vw && vh) {
        const scale = Math.max(targetW / vw, targetH / vh);
        const nw = vw * scale;
        const nh = vh * scale;
        const nx = (targetW - nw) / 2;
        const ny = (targetH - nh) / 2;

        ctx.clearRect(0, 0, targetW, targetH);
        ctx.drawImage(video, nx, ny, nw, nh);
      } else {
        ctx.drawImage(video, 0, 0, targetW, targetH);
      }

      animIdRef.current = requestAnimationFrame(drawFrame);
    }
  }, []);

  const playVideo = useCallback(async () => {
    const v = await prepareVideo();
    if (!v) return;

    v.play().then(() => {
      setIsPlaying(true);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      animIdRef.current = requestAnimationFrame(drawFrame);
    }).catch((err) => {
      console.warn('Video playback prevented:', err);
    });
  }, [prepareVideo, drawFrame]);

  const pauseVideo = useCallback(() => {
    const v = videoRef.current;
    if (v && !v.paused) {
      v.pause();
    }
    setIsPlaying(false);
    if (animIdRef.current) {
      cancelAnimationFrame(animIdRef.current);
      animIdRef.current = null;
    }
  }, []);

  // Preload video & set up IntersectionObserver for auto-playing when scrolling into view
  useEffect(() => {
    prepareVideo();
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            pauseVideo();
          }
        });
      },
      {
        threshold: 0.35, // Plays when 35% of the card is visible on screen
      }
    );

    observer.observe(card);

    return () => {
      observer.disconnect();
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current = null;
      }
    };
  }, [prepareVideo, playVideo, pauseVideo]);

  const togglePlayback = async (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v || v.paused) {
      await playVideo();
    } else {
      pauseVideo();
    }
  };

  return (
    <div 
      ref={cardRef}
      className={`expertise-card ${isPlaying ? 'is-playing' : ''}`}
      onMouseEnter={playVideo}
      onMouseLeave={pauseVideo}
      onClick={togglePlayback}
      role="region"
      aria-label={t(titleKey)}
    >
      <div className="expertise-media">
        <Image 
          src={img} 
          alt={isAr ? `صورة توضيحية لخدمة ${t(titleKey)}` : `${t(titleKey)} illustrative service visual`} 
          width={400}
          height={300}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          className="expertise-img" 
        />
        <canvas 
          ref={canvasRef} 
          className="expertise-canvas"
          aria-hidden="true"
        />
        <div className="expertise-overlay"></div>
      </div>
      <div className="expertise-content">
        <div className="expertise-badge badge-live">
          <span className="badge-dot"></span>
          <span>{t('badge_live')}</span>
        </div>
        <h3 className="expertise-title font-bold text-lg text-white mb-2">
          {t(titleKey)}
        </h3>
        <p className="expertise-desc text-sm text-[#CBD5E1] mb-0">
          {t(descKey)}
        </p>
      </div>
    </div>
  );
}
