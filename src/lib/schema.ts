import { z } from 'zod';

export const CreatePerformanceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  team: z.string().optional(),
  eventDate: z.string().datetime().optional().nullable(),
});

export const UpdatePerformanceSchema = z.object({
  name: z.string().min(1).optional(),
  team: z.string().optional().nullable(),
  eventDate: z.string().datetime().optional().nullable(),
});

export const CreateTrackSchema = z.object({
  performanceId: z.string(),
  fileName: z.string().min(1),
  durationSec: z.number().positive(),
  bpm: z.number().min(40).max(240),
  offsetSec: z.number(),
});

export const UpdateTrackSchema = z.object({
  bpm: z.number().min(40).max(240).optional(),
  offsetSec: z.number().optional(),
});

export const UpdateCountNoteSchema = z.object({
  text: z.string(),
});

export const BatchCreatePerformanceSchema = z.object({
  performance: z.object({
    name: z.string().min(1),
    team: z.string().optional(),
    eventDate: z.string().datetime().nullable().optional(),
  }),
  track: z.object({
    performanceId: z.string(),
    fileName: z.string().min(1),
    durationSec: z.number().positive(),
    bpm: z.number().min(40).max(240),
    offsetSec: z.number(),
  }),
  notes: z.array(
    z.object({
      performanceId: z.string(),
      measureIndex: z.number().int().min(0),
      countInMeasure: z.number().int().min(1).max(8),
      atSec: z.number(),
      text: z.string(),
    })
  ),
});
