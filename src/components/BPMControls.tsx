'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TapTempo } from './TapTempo';

interface BPMControlsProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onRebuildGrid: () => void;
}

export function BPMControls({ bpm, onBpmChange, onRebuildGrid }: BPMControlsProps) {
  const [localBpm, setLocalBpm] = useState(bpm.toString());

  const handleBlur = () => {
    const parsed = parseFloat(localBpm);
    if (!isNaN(parsed) && parsed >= 40 && parsed <= 240) {
      onBpmChange(parsed);
    } else {
      setLocalBpm(bpm.toString());
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bpm">BPM</Label>
        <Input
          id="bpm"
          type="number"
          min="40"
          max="240"
          value={localBpm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalBpm(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      <TapTempo onBpmDetected={(bpm: number) => {
        setLocalBpm(bpm.toString());
        onBpmChange(bpm);
      }} />
      <Button onClick={onRebuildGrid} variant="secondary" className="w-full">
        Rebuild Grid
      </Button>
    </div>
  );
}
