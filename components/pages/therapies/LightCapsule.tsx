"use client"

import React, { useRef, useState, useEffect } from "react";

interface LightCapsuleProps {
  videoUrl: string;
  posterUrl: string;
  title: string;
  description: string;
  className?: string;
}

const LightCapsule: React.FC<LightCapsuleProps> = ({
  videoUrl,
  posterUrl,
  title,
  description,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressTrackRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleError = () => setVideoError("Erreur de chargement de la vidéo.");

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);

    // Clean up
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
    };
  }, []);

  // Scrubber logic
  const seekTo = (clientX: number) => {
    const video = videoRef.current;
    const track = progressTrackRef.current;
    if (!video || !track) return;
    const rect = track.getBoundingClientRect();
    const clickPosition = (clientX - rect.left) / rect.width;
    const clampedPosition = Math.max(0, Math.min(1, clickPosition));
    const seekTime = clampedPosition * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    seekTo(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) seekTo(e.clientX);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    seekTo(e.touches[0].clientX);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      seekTo(e.touches[0].clientX);
    }
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  // Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            setVideoError(`Erreur de lecture: ${error.message}`);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "00:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`w-full max-w-3xl mx-auto mt-8 bg-transparent rounded-3xl p-6 md:p-10 flex flex-col items-start ${className}`}>
      <div className="w-full rounded-3xl overflow-hidden mb-6 relative">
        <div className="relative pb-[56.25%] w-full">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-xl"
            src={videoUrl}
            poster={posterUrl}
            preload="metadata"
            controls={false}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setVideoError("Erreur de chargement de la vidéo.")}
            style={{ background: '#3C5855' }}
          />
          {/* Play/Pause Button */}
          <div className="absolute left-4 bottom-4 z-20">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 cursor-pointer"
              aria-label={isPlaying ? 'Pause media' : 'Play media'}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* Scrubber */}
      <div className="mt-4 w-full select-none">
        {videoError && (
          <div className="text-red-500 bg-white/80 rounded-lg px-4 py-2 mb-2 text-xs">{videoError}</div>
        )}
        <div className="flex items-center justify-between text-xs text-white/70 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div
          ref={progressTrackRef}
          className="h-3 bg-white/10 rounded-full cursor-pointer relative overflow-hidden hover:bg-white/15 transition-colors select-none z-10"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ userSelect: 'none' }}
        >
          {/* Background track with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full"></div>
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 h-full bg-white/60 rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          ></div>
          {/* Progress handle */}
          <div
            className="h-5 w-5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 -ml-2.5 shadow-md transition-transform duration-150 transform hover:scale-110"
            style={{
              left: `${(currentTime / (duration || 1)) * 100}%`,
              display: duration ? 'block' : 'none',
              opacity: isDragging ? '1' : '0.7',
              transform: isDragging ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
              pointerEvents: 'auto',
              zIndex: 20,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          ></div>
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 mt-6">{title}</h2>
      <p className="text-white/80 text-base md:text-lg mb-2">{description}</p>
    </div>
  );
};

export default LightCapsule;
