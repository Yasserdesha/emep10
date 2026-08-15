"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from './LanguageContext';

// Global memory cache to avoid double fetching of video blobs
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
    console.warn(`[E-MEP Engine] Failed to fetch asset ${datUrl}:`, err);
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
  const { t, language, isMounted } = useLanguage();
  const isAr = isMounted && language === 'ar';

  const cardRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Lazy prepare video blob on demand (hover/click/idle)
  const prepareVideo = useCallback(async (): Promise<string | null> => {
    if (videoUrl) return videoUrl;
    const url = await getProtectedBlobUrl(datSrc);
    if (url) {
      setVideoUrl(url);
    }
    return url;
  }, [datSrc, videoUrl]);

  const playVideo = useCallback(async () => {
    const url = await prepareVideo();
    if (!url) return;

    // Small delay to ensure state update attaches src
    setTimeout(() => {
      const v = videoRef.current;
      if (v) {
        v.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Silent fallback on browser autoplay restrictions
        });
      }
    }, 50);
  }, [prepareVideo]);

  const pauseVideo = useCallback(() => {
    const v = videoRef.current;
    if (v && !v.paused) {
      v.pause();
    }
    setIsPlaying(false);
  }, []);

  // Preload video as soon as the card enters the viewport so it's ready instantly on hover
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            prepareVideo();
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      prepareVideo();
    }
  }, [prepareVideo]);

  const togglePlayback = async (e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    if (!isPlaying) {
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
          style={{ objectFit: 'cover', width: '100%', height: '100%', aspectRatio: '4/3' }}
          className="expertise-img" 
        />

        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted
            playsInline
            className={`expertise-video ${isPlaying ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 absolute inset-0 w-full h-full object-cover`}
          />
        )}

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
