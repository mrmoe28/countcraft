/**
 * Format seconds to mm:ss.mmm
 */
export function formatTime(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const milliseconds = Math.floor((sec % 1) * 1000);

  return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Convert milliseconds to seconds
 */
export function toSec(ms: number): number {
  return ms / 1000;
}

/**
 * Format duration as mm:ss
 */
export function formatDuration(sec: number): string {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
