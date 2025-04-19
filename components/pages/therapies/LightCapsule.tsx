"use client"

import React, { useRef, useState, useEffect } from "react";

// Create a unique ID for each LightCapsule instance
let nextVideoId = 0;

interface LightCapsuleProps {
  videoUrl: string;
  posterUrl: string;
  title: string;
  description: string;
  className?: string;
  videoDuration?: number;
}

const LightCapsule: React.FC<LightCapsuleProps> = ({
  videoUrl,
  posterUrl,
  title,
  description,
  className = '',
  videoDuration,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressTrackRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState<string | null>(null);
  // Unique ID for this video player instance
  const videoId = useRef(`video-player-${nextVideoId++}`);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleError = () => setVideoError("Erreur de chargement de la vidéo.");

    // Listen for play events from other videos
    const handleOtherVideoPlay = (e: CustomEvent) => {
      if (e.detail.videoId !== videoId.current && isPlaying) {
        video.pause();
        setIsPlaying(false);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);
    document.addEventListener("videoPlay" as any, handleOtherVideoPlay as EventListener);

    // Clean up
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      document.removeEventListener("videoPlay" as any, handleOtherVideoPlay as EventListener);
    };
  }, [isPlaying]);

  // Scrubber logic - simplified version
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const track = progressTrackRef.current;
    if (!video || !track) return;
    
    const rect = track.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const clampedPosition = Math.max(0, Math.min(1, position));
    
    // Use actual duration from video element
    video.currentTime = clampedPosition * video.duration;
  };

  // Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            // Broadcast that this video is playing to pause others
            document.dispatchEvent(
              new CustomEvent("videoPlay", {
                detail: { videoId: videoId.current }
              })
            );
          })
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

  // Which duration to display on the right
  const displayDuration = duration > 0 ? duration : (videoDuration || 0);

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleVideoError = () => {
    setVideoError("Erreur de lecture de la vidéo.");
  };

  return (
    <div className={`w-full max-w-3xl mx-auto mt-8 bg-transparent rounded-3xl flex flex-col items-start ${className}`}>
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
            onEnded={handleVideoEnd}
            onError={handleVideoError}
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
          <span>{formatTime(displayDuration)}</span>
        </div>
        <div
          ref={progressTrackRef}
          className="h-3 bg-white/10 rounded-full cursor-pointer relative overflow-hidden hover:bg-white/15 transition-colors select-none z-10"
          onClick={handleScrubberClick}
          style={{ userSelect: 'none' }}
        >
          {/* Background track with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full"></div>
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 h-full bg-white/60 rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LightCapsule;
