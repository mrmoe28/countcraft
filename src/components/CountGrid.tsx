'use client';

import { useState, useCallback } from 'react';
import { CountNote } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CountGridProps {
  notes: CountNote[];
  currentIndex?: number;
  onUpdateNote: (noteId: string, text: string) => Promise<void>;
  className?: string;
}

export function CountGrid({ notes, currentIndex, onUpdateNote, className }: CountGridProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = useCallback((note: CountNote) => {
    setEditingId(note.id);
    setEditValue(note.text);
  }, []);

  const handleSave = useCallback(async (note: CountNote) => {
    await onUpdateNote(note.id, editValue);
    setEditingId(null);
  }, [editValue, onUpdateNote]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, note: CountNote) => {
    if (e.key === 'Enter') {
      handleSave(note);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  }, [handleSave]);

  // Group notes by measure
  const measures = notes.reduce((acc, note) => {
    if (!acc[note.measureIndex]) {
      acc[note.measureIndex] = [];
    }
    acc[note.measureIndex].push(note);
    return {};
  }, {} as Record<number, CountNote[]>);

  const measureIndices = Object.keys(measures).map(Number).sort((a, b) => a - b);

  return (
    <div className={cn('space-y-4', className)}>
      {measureIndices.map(measureIndex => {
        const measureNotes = notes.filter(n => n.measureIndex === measureIndex).sort((a, b) => a.countInMeasure - b.countInMeasure);

        return (
          <div key={measureIndex} className="border rounded-lg p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Measure {measureIndex + 1}
            </div>
            <div className="grid grid-cols-8 gap-2">
              {measureNotes.map((note, idx) => {
                const globalIdx = notes.findIndex(n => n.id === note.id);
                const isCurrent = globalIdx === currentIndex;
                const isEditing = editingId === note.id;

                return (
                  <div
                    key={note.id}
                    className={cn(
                      'border rounded p-2 min-h-[60px] transition-colors',
                      isCurrent && 'ring-2 ring-primary bg-primary/10',
                      !isCurrent && 'hover:bg-muted/50'
                    )}
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {note.countInMeasure}
                    </div>
                    {isEditing ? (
                      <Input
                        value={editValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(note)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, note)}
                        autoFocus
                        className="h-8 text-sm"
                      />
                    ) : (
                      <div
                        className="text-sm cursor-pointer min-h-[24px]"
                        onClick={() => handleEdit(note)}
                      >
                        {note.text || (
                          <span className="text-muted-foreground/50 italic">empty</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
