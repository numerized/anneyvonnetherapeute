'use client';

import { InlineWidget } from 'react-calendly';
import { X } from 'lucide-react';
import { useCalendlyEventListener } from 'react-calendly';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventScheduled: () => void;
}

export function CalendlyModal({ isOpen, onClose, onEventScheduled }: CalendlyModalProps) {
  if (!isOpen) return null;

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      onEventScheduled();
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-7xl mx-auto p-4">
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-50 p-2 rounded-full bg-primary-forest/80 text-primary-cream hover:bg-primary-forest transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="w-full h-full bg-white rounded-[32px] overflow-hidden">
          <InlineWidget
            url="https://calendly.com/numerized-ara/1h"
            styles={{
              height: '100%',
              width: '100%',
              minHeight: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
}
