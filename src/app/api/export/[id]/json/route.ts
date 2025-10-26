import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    const json = JSON.stringify(performance, null, 2);

    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${performance.name}_counts.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}
