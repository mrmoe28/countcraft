/**
 * Estimate BPM from audio buffer using simple peak detection
 * Fallback implementation (web-audio-beat-detector can be added later)
 */
export async function estimateBpmFromBuffer(audioBuffer: AudioBuffer): Promise<number> {
  try {
    // Simple autocorrelation-based tempo detection
    const sampleRate = audioBuffer.sampleRate;
    const channelData = audioBuffer.getChannelData(0);

    // Downsample for performance
    const downsampleFactor = 200;
    const samples: number[] = [];
    for (let i = 0; i < channelData.length; i += downsampleFactor) {
      samples.push(Math.abs(channelData[i]));
    }

    // Find peaks
    const peaks: number[] = [];
    for (let i = 1; i < samples.length - 1; i++) {
      if (samples[i] > samples[i - 1] && samples[i] > samples[i + 1] && samples[i] > 0.3) {
        peaks.push(i);
      }
    }

    if (peaks.length < 2) {
      return 120; // Default fallback
    }

    // Calculate intervals between peaks
    const intervals: number[] = [];
    for (let i = 1; i < Math.min(peaks.length, 50); i++) {
      intervals.push(peaks[i] - peaks[i - 1]);
    }

    // Find most common interval (mode)
    const intervalCounts = new Map<number, number>();
    intervals.forEach(interval => {
      intervalCounts.set(interval, (intervalCounts.get(interval) || 0) + 1);
    });

    let maxCount = 0;
    let commonInterval = 0;
    intervalCounts.forEach((count, interval) => {
      if (count > maxCount) {
        maxCount = count;
        commonInterval = interval;
      }
    });

    if (commonInterval === 0) {
      return 120;
    }

    // Convert interval to BPM
    const intervalInSamples = commonInterval * downsampleFactor;
    const intervalInSeconds = intervalInSamples / sampleRate;
    const bpm = Math.round(60 / intervalInSeconds);

    // Clamp to reasonable range
    if (bpm < 60) return bpm * 2; // Double time
    if (bpm > 200) return Math.round(bpm / 2); // Half time

    return bpm;
  } catch (error) {
    console.error('BPM estimation failed:', error);
    return 120; // Default fallback
  }
}

/**
 * Calculate number of measures and total counts for a duration and BPM
 */
export function countsFor(durationSec: number, bpm: number): { measures: number; totalCounts: number } {
  const beatDuration = 60 / bpm;
  const countsPerMeasure = 8;
  const measureDuration = beatDuration * countsPerMeasure;
  const measures = Math.ceil(durationSec / measureDuration);
  const totalCounts = measures * countsPerMeasure;

  return { measures, totalCounts };
}
