import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreatePerformanceSchema, BatchCreatePerformanceSchema } from '@/lib/schema';
import type { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const performances = await prisma.performance.findMany({
      include: {
        track: true,
        countNotes: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(performances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch performances' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if batch create (with track + notes)
    if (body.track && body.notes) {
      const validated = BatchCreatePerformanceSchema.parse(body);

      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Check if performance already exists
        let performance = await tx.performance.findUnique({
          where: { id: validated.track.performanceId },
        });

        if (!performance) {
          performance = await tx.performance.create({
            data: {
              id: validated.track.performanceId,
              name: validated.performance.name,
              team: validated.performance.team,
              eventDate: validated.performance.eventDate ? new Date(validated.performance.eventDate) : null,
            },
          });
        }

        // Delete existing track and notes if any
        await tx.track.deleteMany({
          where: { performanceId: performance.id },
        });
        await tx.countNote.deleteMany({
          where: { performanceId: performance.id },
        });

        // Create track
        const track = await tx.track.create({
          data: validated.track,
        });

        // Create notes
        await tx.countNote.createMany({
          data: validated.notes,
        });

        return { performance, track };
      });

      return NextResponse.json(result);
    }

    // Simple performance create
    const validated = CreatePerformanceSchema.parse(body);

    const performance = await prisma.performance.create({
      data: {
        name: validated.name,
        team: validated.team,
        eventDate: validated.eventDate ? new Date(validated.eventDate) : null,
      },
    });

    return NextResponse.json(performance);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Performance creation error:', error);
      return NextResponse.json({
        error: 'Failed to create performance',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { status: 500 });
    }
    console.error('Unknown performance creation error:', error);
    return NextResponse.json({ error: 'Failed to create performance' }, { status: 500 });
  }
}
