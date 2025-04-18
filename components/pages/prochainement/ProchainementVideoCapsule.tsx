"use client"

import React, { useRef, useState, useEffect } from "react";
import { Header } from "@/components/shared/Header";

// This component is a minimal, centered capsule player for a single video, no tags or description
export interface ProchainementVideoCapsuleProps {
  title: string;
  introduction?: string;
  videoUrl: string;
  posterUrl?: string;
}

export default function ProchainementVideoCapsule({
  title,
  introduction,
  videoUrl,
  posterUrl,
}: ProchainementVideoCapsuleProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="w-full max-w-xl mx-auto flex flex-col items-center py-12 px-4">
      <Header title={title} description={introduction} centered />
      <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-[32px] overflow-hidden mt-8 shadow-xl px-2">
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-[32px]"
          src={videoUrl}
          poster={posterUrl}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        {/* Play/Pause button overlay */}
        <button
          onClick={handlePlayPause}
          className="absolute right-4 bottom-4 z-20 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          type="button"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </button>
      </div>
    </section>
  );
}
