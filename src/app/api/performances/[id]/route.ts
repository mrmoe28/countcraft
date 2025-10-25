import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { computeGrid, generateEmptyNotes } from '@/lib/counts';
import type { Prisma, CountNote } from '@prisma/client';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const performance = await prisma.performance.findUnique({
      where: { id },
      include: {
        track: true,
        countNotes: {
          orderBy: [{ measureIndex: 'asc' }, { countInMeasure: 'asc' }],
        },
      },
    });

    if (!performance) {
      return NextResponse.json({ error: 'Performance not found' }, { status: 404 });
    }

    return NextResponse.json(performance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch performance' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await request.json();

    // Update a specific note
    if (body.noteId && body.text !== undefined) {
      const note = await prisma.countNote.update({
        where: { id: body.noteId },
        data: { text: body.text },
      });
      return NextResponse.json(note);
    }

    // Rebuild grid with new BPM/offset
    if (body.bpm !== undefined || body.offsetSec !== undefined) {
      const performance = await prisma.performance.findUnique({
        where: { id },
        include: { track: true, countNotes: true },
      });

      if (!performance || !performance.track) {
        return NextResponse.json({ error: 'Performance or track not found' }, { status: 404 });
      }

      const newBpm = body.bpm ?? performance.track.bpm;
      const newOffset = body.offsetSec ?? performance.track.offsetSec;

      const newGrid = computeGrid({
        durationSec: performance.track.durationSec,
        bpm: newBpm,
        offsetSec: newOffset,
      });

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Update track
        await tx.track.update({
          where: { id: performance.track!.id },
          data: {
            bpm: newBpm,
            offsetSec: newOffset,
          },
        });

        // Delete old notes
        await tx.countNote.deleteMany({
          where: { performanceId: id },
        });

        // Create new notes preserving text where possible
        const oldNotes = performance.countNotes;
        const newNotes = newGrid.map(cell => {
          const existing = oldNotes.find(
            (n: CountNote) => n.measureIndex === cell.measureIndex && n.countInMeasure === cell.countInMeasure
          );
          return {
            performanceId: id,
            measureIndex: cell.measureIndex,
            countInMeasure: cell.countInMeasure,
            atSec: cell.atSec,
            text: existing?.text || '',
          };
        });

        await tx.countNote.createMany({
          data: newNotes,
        });
      });

      return NextResponse.json({ success: true });
    }

    // Update performance metadata
    const updated = await prisma.performance.update({
      where: { id },
      data: {
        name: body.name,
        team: body.team,
        eventDate: body.eventDate ? new Date(body.eventDate) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to update performance', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to update performance' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await prisma.performance.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete performance' }, { status: 500 });
  }
}
