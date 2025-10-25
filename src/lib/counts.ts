export interface GridCell {
  measureIndex: number;
  countInMeasure: number; // 1-8
  atSec: number;
}

/**
 * Compute the full count grid based on track parameters
 */
export function computeGrid({
  durationSec,
  bpm,
  offsetSec,
}: {
  durationSec: number;
  bpm: number;
  offsetSec: number;
}): GridCell[] {
  const beatDuration = 60 / bpm;
  const countsPerMeasure = 8;
  const measureDuration = beatDuration * countsPerMeasure;
  const measures = Math.ceil(durationSec / measureDuration);

  const grid: GridCell[] = [];

  for (let m = 0; m < measures; m++) {
    for (let c = 1; c <= countsPerMeasure; c++) {
      const atSec = offsetSec + m * measureDuration + (c - 1) * beatDuration;
      if (atSec <= durationSec) {
        grid.push({
          measureIndex: m,
          countInMeasure: c,
          atSec,
        });
      }
    }
  }

  return grid;
}

/**
 * Recompute atSec for all grid cells with new offset
 */
export function applyOffset(grid: GridCell[], newOffsetSec: number, bpm: number): GridCell[] {
  const beatDuration = 60 / bpm;
  const countsPerMeasure = 8;
  const measureDuration = beatDuration * countsPerMeasure;

  return grid.map(cell => ({
    ...cell,
    atSec: newOffsetSec + cell.measureIndex * measureDuration + (cell.countInMeasure - 1) * beatDuration,
  }));
}

/**
 * Find the nearest count index at the given playhead position
 */
export function nearestCountAt(playheadSec: number, grid: GridCell[]): number {
  if (grid.length === 0) return -1;

  let closestIndex = 0;
  let closestDist = Math.abs(grid[0].atSec - playheadSec);

  for (let i = 1; i < grid.length; i++) {
    const dist = Math.abs(grid[i].atSec - playheadSec);
    if (dist < closestDist) {
      closestDist = dist;
      closestIndex = i;
    }
  }

  return closestIndex;
}

/**
 * Generate empty CountNote create inputs from grid
 */
export function generateEmptyNotes(performanceId: string, grid: GridCell[]) {
  return grid.map(cell => ({
    performanceId,
    measureIndex: cell.measureIndex,
    countInMeasure: cell.countInMeasure,
    atSec: cell.atSec,
    text: '',
  }));
}
