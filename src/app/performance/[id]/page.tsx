'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Waveform } from '@/components/Waveform';
import { CountGrid } from '@/components/CountGrid';
import { SpeakToFill } from '@/components/SpeakToFill';
import { TransportBar } from '@/components/TransportBar';
import { BPMControls } from '@/components/BPMControls';
import { OffsetControls } from '@/components/OffsetControls';
import { ExportMenu } from '@/components/ExportMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { estimateBpmFromBuffer } from '@/lib/bpm';
import { computeGrid, nearestCountAt, generateEmptyNotes, GridCell } from '@/lib/counts';
import type { Performance, Track, CountNote } from '@prisma/client';

export default function PerformanceEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [performance, setPerformance] = useState<Performance | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [notes, setNotes] = useState<CountNote[]>([]);
  const [grid, setGrid] = useState<GridCell[]>([]);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<ArrayBuffer | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentCountIndex, setCurrentCountIndex] = useState(-1);

  useEffect(() => {
    loadPerformance();
  }, [id]);

  const loadPerformance = async () => {
    const res = await fetch(`/api/performances/${id}`);
    if (!res.ok) {
      toast({ title: 'Error loading performance', variant: 'destructive' });
      return;
    }
    const data = await res.json();
    setPerformance(data);
    setTrack(data.track || null);
    setNotes(data.countNotes || []);

    if (data.track) {
      const newGrid = computeGrid({
        durationSec: data.track.durationSec,
        bpm: data.track.bpm,
        offsetSec: data.track.offsetSec,
      });
      setGrid(newGrid);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    const arrayBuffer = await file.arrayBuffer();
    setAudioBuffer(arrayBuffer);

    const audioContext = new AudioContext();
    const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    const detectedBpm = await estimateBpmFromBuffer(decoded);
    const trackDuration = decoded.duration;

    setDuration(trackDuration);

    const newGrid = computeGrid({
      durationSec: trackDuration,
      bpm: detectedBpm,
      offsetSec: 0,
    });
    setGrid(newGrid);

    const trackData = {
      performanceId: id,
      fileName: file.name,
      durationSec: trackDuration,
      bpm: detectedBpm,
      offsetSec: 0,
    };

    const notesData = generateEmptyNotes(id, newGrid);

    const res = await fetch('/api/performances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        performance: {
          name: performance?.name || 'Untitled',
          team: performance?.team || undefined,
          eventDate: performance?.eventDate ? new Date(performance.eventDate).toISOString() : null,
        },
        track: trackData,
        notes: notesData,
      }),
    });

    if (res.ok) {
      loadPerformance();
      toast({ title: 'Track uploaded!' });
    }
  };

  const handleBpmChange = async (newBpm: number) => {
    if (!track) return;
    const newGrid = computeGrid({
      durationSec: track.durationSec,
      bpm: newBpm,
      offsetSec: track.offsetSec,
    });
    setGrid(newGrid);
  };

  const handleOffsetChange = async (newOffset: number) => {
    if (!track) return;
    const newGrid = computeGrid({
      durationSec: track.durationSec,
      bpm: track.bpm,
      offsetSec: newOffset,
    });
    setGrid(newGrid);
  };

  const handleRebuildGrid = async () => {
    if (!track) return;
    const res = await fetch(`/api/performances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bpm: track.bpm, offsetSec: track.offsetSec }),
    });
    if (res.ok) {
      loadPerformance();
      toast({ title: 'Grid rebuilt!' });
    }
  };

  const handleUpdateNote = async (noteId: string, text: string) => {
    const res = await fetch(`/api/performances/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId, text }),
    });
    if (res.ok) {
      setNotes(prev => prev.map(n => (n.id === noteId ? { ...n, text } : n)));
    }
  };

  const handleTranscript = async (countIndex: number, text: string) => {
    const note = notes[countIndex];
    if (note) {
      await handleUpdateNote(note.id, text);
    }
  };

  useEffect(() => {
    if (grid.length > 0) {
      const idx = nearestCountAt(currentTime, grid);
      setCurrentCountIndex(idx);
    }
  }, [currentTime, grid]);

  if (!performance) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">{performance.name}</h1>
        </div>
        {track && <ExportMenu performanceId={id} performanceName={performance.name} />}
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          {audioBuffer && track ? (
            <>
              <TransportBar
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onSeek={sec => setCurrentTime(sec)}
              />
              <div className="p-4">
                <Waveform
                  audioSource={audioBuffer}
                  markers={grid}
                  onReady={setDuration}
                  onPlayhead={setCurrentTime}
                  className="mb-4"
                />
              </div>
              <div className="flex-1 overflow-auto p-4">
                <CountGrid
                  notes={notes}
                  currentIndex={currentCountIndex}
                  onUpdateNote={handleUpdateNote}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Upload Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input type="file" accept="audio/*" onChange={handleFileSelect} />
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload an MP3 or WAV file to start counting
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {track && (
          <div className="w-80 border-l p-4 overflow-auto">
            <Tabs defaultValue="controls">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="voice">Voice</TabsTrigger>
              </TabsList>
              <TabsContent value="controls" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">BPM</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BPMControls
                      bpm={track.bpm}
                      onBpmChange={handleBpmChange}
                      onRebuildGrid={handleRebuildGrid}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Offset</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OffsetControls
                      offsetSec={track.offsetSec}
                      onOffsetChange={handleOffsetChange}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="voice">
                <SpeakToFill
                  isPlaying={isPlaying}
                  currentCountIndex={currentCountIndex}
                  onTranscript={handleTranscript}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
