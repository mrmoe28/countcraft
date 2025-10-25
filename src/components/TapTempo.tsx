'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface TapTempoProps {
  onBpmDetected: (bpm: number) => void;
}

export function TapTempo({ onBpmDetected }: TapTempoProps) {
  const [taps, setTaps] = useState<number[]>([]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const newTaps = [...taps, now].slice(-4);
    setTaps(newTaps);

    if (newTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      onBpmDetected(bpm);
    }
  }, [taps, onBpmDetected]);

  return (
    <Button onClick={handleTap} variant="outline" className="w-full">
      Tap Tempo {taps.length > 1 && `(${taps.length} taps)`}
    </Button>
  );
}
