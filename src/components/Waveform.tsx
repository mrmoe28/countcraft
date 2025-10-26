'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { GridCell } from '@/lib/counts';

interface WaveformProps {
  audioSource: string | ArrayBuffer;
  markers: GridCell[];
  onReady?: (duration: number) => void;
  onPlayhead?: (sec: number) => void;
  onSeek?: (sec: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
  audioFile?: File;
}

export interface WaveformRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (sec: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

export const Waveform = forwardRef<WaveformRef, WaveformProps>(function Waveform({ audioSource, markers, onReady, onPlayhead, onSeek, onPlay, onPause, className }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    play: () => wavesurferRef.current?.play(),
    pause: () => wavesurferRef.current?.pause(),
    stop: () => wavesurferRef.current?.stop(),
    seek: (sec: number) => {
      const duration = wavesurferRef.current?.getDuration() || 1;
      wavesurferRef.current?.seekTo(sec / duration);
    },
    getCurrentTime: () => wavesurferRef.current?.getCurrentTime() || 0,
    getDuration: () => wavesurferRef.current?.getDuration() || 0,
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4ade80',
      progressColor: '#22c55e',
      cursorColor: '#f59e0b',
      barWidth: 2,
      barGap: 1,
      height: 128,
      normalize: true,
      backend: 'WebAudio',
    });

    wavesurferRef.current = wavesurfer;

    if (typeof audioSource === 'string') {
      wavesurfer.load(audioSource);
    } else {
      const blob = new Blob([audioSource], { type: 'audio/mpeg' });
      wavesurfer.loadBlob(blob);
    }

    wavesurfer.on('ready', () => {
      const duration = wavesurfer.getDuration();
      onReady?.(duration);
    });

    wavesurfer.on('audioprocess', () => {
      const currentTime = wavesurfer.getCurrentTime();
      onPlayhead?.(currentTime);
    });

    wavesurfer.on('play', () => {
      setIsPlaying(true);
      onPlay?.();
    });
    wavesurfer.on('pause', () => {
      setIsPlaying(false);
      onPause?.();
    });

    wavesurfer.on('interaction', () => {
      const currentTime = wavesurfer.getCurrentTime();
      onSeek?.(currentTime);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [audioSource]);

  // Update markers
  useEffect(() => {
    const wavesurfer = wavesurferRef.current;
    if (!wavesurfer || markers.length === 0) return;

    // Clear existing markers (wavesurfer.js doesn't have built-in markers in v7)
    // This is simplified; in production you'd overlay custom divs for markers
  }, [markers]);

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full" />
    </div>
  );
});

