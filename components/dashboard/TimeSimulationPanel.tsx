'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FastForward, Rewind } from 'lucide-react';
import { addDays, addWeeks, format, parse, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

interface TimeSimulationPanelProps {
  onDateChange: (newDate: Date) => void;
  isEnabled: boolean;
}

export function TimeSimulationPanel({ onDateChange, isEnabled }: TimeSimulationPanelProps) {
  const [currentSimDate, setCurrentSimDate] = useState<Date>(new Date());
  const [dateInputValue, setDateInputValue] = useState<string>('');

  // Initialize with today's date formatted
  useEffect(() => {
    const formattedDate = format(new Date(), 'dd/MM/yyyy', { locale: fr });
    setDateInputValue(formattedDate);
  }, []);

  // Apply the date change
  const applyDateChange = (date: Date) => {
    setCurrentSimDate(date);
    onDateChange(date);
    // Format and update the input display
    const formattedDate = format(date, 'dd/MM/yyyy', { locale: fr });
    setDateInputValue(formattedDate);
  };

  // Handle direct date input change
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInputValue(e.target.value);
  };

  // Parse and apply the manually entered date
  const handleDateInputBlur = () => {
    try {
      const parsedDate = parse(dateInputValue, 'dd/MM/yyyy', new Date());
      if (isNaN(parsedDate.getTime())) {
        // Invalid date, reset to current simulation date
        setDateInputValue(format(currentSimDate, 'dd/MM/yyyy', { locale: fr }));
        return;
      }
      applyDateChange(parsedDate);
    } catch (error) {
      console.error('Error parsing date:', error);
      // Reset to current simulation date
      setDateInputValue(format(currentSimDate, 'dd/MM/yyyy', { locale: fr }));
    }
  };

  // Shortcut buttons to advance time
  const advanceTime = (days: number) => {
    const newDate = addDays(currentSimDate, days);
    applyDateChange(newDate);
  };

  if (!isEnabled) return null;

  return (
    <div style={{ backgroundColor: '#047857', backdropFilter: 'none' }} className="fixed bottom-4 right-4 z-50 p-4 border border-emerald-800 rounded-lg shadow-lg">
      <div style={{ backgroundColor: '#047857' }} className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-white">Mode Simulation Temporelle</h3>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-white" />
          <Input
            type="text"
            value={dateInputValue}
            onChange={handleDateInputChange}
            onBlur={handleDateInputBlur}
            placeholder="jj/mm/aaaa"
            style={{ backgroundColor: '#065f46', color: 'white' }}
            className="w-32 h-7 text-xs border-emerald-300 focus:border-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs border-white text-white hover:bg-emerald-800 flex items-center gap-1"
            onClick={() => advanceTime(-1)}
          >
            <Rewind className="h-3 w-3" /> -1 Jour
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs border-white text-white hover:bg-emerald-800 flex items-center gap-1"
            onClick={() => advanceTime(1)}
          >
            +1 Jour <FastForward className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs border-white text-white hover:bg-emerald-800 flex items-center gap-1"
            onClick={() => advanceTime(-7)}
          >
            <Rewind className="h-3 w-3" /> -1 Semaine
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs border-white text-white hover:bg-emerald-800 flex items-center gap-1"
            onClick={() => advanceTime(7)}
          >
            +1 Semaine <FastForward className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs border-white text-white hover:bg-emerald-800 flex items-center gap-1"
            onClick={() => advanceTime(-28)}
          >
            <Rewind className="h-3 w-3" /> -4 Semaines
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="h-7 text-xs border-white text-white hover:bg-emerald-800 flex items-center gap-1"
            onClick={() => advanceTime(28)}
          >
            +4 Semaines <FastForward className="h-3 w-3" />
          </Button>
        </div>

        <div className="text-xs mt-1 text-white border-t pt-2 border-emerald-800">
          Date actuelle simulée: <strong>{format(currentSimDate, 'dd MMMM yyyy', { locale: fr })}</strong>
        </div>
      </div>
    </div>
  );
}
