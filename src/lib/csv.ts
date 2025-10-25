import { CountNote } from '@prisma/client';

/**
 * Convert count notes to CSV format
 */
export function toCSV(notes: CountNote[]): string {
  const header = 'Measure,Count,Time (sec),Text\n';

  const rows = notes
    .sort((a, b) => {
      if (a.measureIndex !== b.measureIndex) {
        return a.measureIndex - b.measureIndex;
      }
      return a.countInMeasure - b.countInMeasure;
    })
    .map(note => {
      const escapedText = note.text.includes(',') || note.text.includes('"')
        ? `"${note.text.replace(/"/g, '""')}"`
        : note.text;
      return `${note.measureIndex + 1},${note.countInMeasure},${note.atSec.toFixed(3)},${escapedText}`;
    })
    .join('\n');

  return header + rows;
}
