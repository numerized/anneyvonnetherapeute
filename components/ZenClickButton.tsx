'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export function ZenClickButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className={`rounded-full px-6 py-3 bg-primary-coral hover:bg-primary-rust text-primary-cream shadow-lg transition-all duration-300 flex items-center gap-2 ${
          isPlaying ? 'animate-pulse' : ''
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-5 h-5" />
            <span>Stop ZenClick</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            <span>ZenClick Session</span>
          </>
        )}
      </Button>
      <audio
        ref={audioRef}
        src="/videos/Zen'clic_startbutton.mp4"
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
