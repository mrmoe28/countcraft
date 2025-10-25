'use client';

import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { formatTime } from '@/lib/time';

interface TransportBarProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (sec: number) => void;
}

export function TransportBar({ isPlaying, currentTime, duration, onPlay, onPause, onSeek }: TransportBarProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Button onClick={isPlaying ? onPause : onPlay} size="icon">
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="text-sm text-muted-foreground">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
}
