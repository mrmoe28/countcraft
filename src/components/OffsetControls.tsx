'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/time';

interface OffsetControlsProps {
  offsetSec: number;
  onOffsetChange: (offset: number) => void;
}

export function OffsetControls({ offsetSec, onOffsetChange }: OffsetControlsProps) {
  const nudge = (ms: number) => {
    onOffsetChange(offsetSec + ms / 1000);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Offset: {formatTime(offsetSec)}</Label>
        <Slider
          value={[offsetSec * 1000]}
          onValueChange={([val]: number[]) => onOffsetChange(val / 1000)}
          min={-2000}
          max={2000}
          step={1}
          className="mt-2"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={() => nudge(-25)} size="sm" variant="outline">
          -25ms
        </Button>
        <Button onClick={() => nudge(-10)} size="sm" variant="outline">
          -10ms
        </Button>
        <Button onClick={() => nudge(-5)} size="sm" variant="outline">
          -5ms
        </Button>
        <Button onClick={() => nudge(5)} size="sm" variant="outline">
          +5ms
        </Button>
        <Button onClick={() => nudge(10)} size="sm" variant="outline">
          +10ms
        </Button>
        <Button onClick={() => nudge(25)} size="sm" variant="outline">
          +25ms
        </Button>
      </div>
    </div>
  );
}
