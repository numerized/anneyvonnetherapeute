'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        transition={{ ease: [0, 0.71, 0.2, 1] }}
      >
        <Button
          onClick={handleClick}
          className={`rounded-full px-6 py-3 bg-primary-coral hover:bg-primary-rust text-primary-cream transition-all duration-300 flex items-center gap-2 animate-glow ${
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
      </motion.div>
      <audio
        ref={audioRef}
        src="/videos/Zen'clic_startbutton.mp4"
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
