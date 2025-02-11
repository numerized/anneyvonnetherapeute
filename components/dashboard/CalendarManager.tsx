'use client';

import { useState } from 'react';
import { InlineWidget } from 'react-calendly';
import { Button } from '@/components/ui/button';
import { Calendar, Settings } from 'lucide-react';

export function CalendarManager() {
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <div className="bg-primary-forest/30 rounded-[32px] p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-coral" />
          <h2 className="text-xl font-semibold text-primary-cream">Gestion du Calendrier</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
          className="hover:bg-primary-forest/30"
        >
          <Settings className="w-5 h-5 text-primary-cream" />
        </Button>
      </div>

      <div className="w-full h-[1100px] rounded-[24px] overflow-hidden bg-primary-forest/30">
        <InlineWidget
          url="https://calendly.com/numerized-ara/1h"
          styles={{
            height: '100%',
            width: '100%',
            minHeight: '1100px'
          }}
        />
      </div>

      {showSettings && (
        <div className="mt-4 p-4 bg-primary-forest/30 rounded-[24px]">
          <h3 className="text-lg font-semibold text-primary-cream mb-3">Paramètres du Calendrier</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-cream mb-1">
                Durée par défaut des séances
              </label>
              <select className="w-full p-2 rounded-[12px] bg-primary-dark text-primary-cream border border-primary-coral/30">
                <option value="60">60 minutes</option>
                <option value="75">75 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-cream mb-1">
                Temps de pause entre les séances
              </label>
              <select className="w-full p-2 rounded-[12px] bg-primary-dark text-primary-cream border border-primary-coral/30">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
