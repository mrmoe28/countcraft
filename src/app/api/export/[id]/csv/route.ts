import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toCSV } from '@/lib/csv';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const performance = await prisma.performance.findUnique({
      where: { id },
      include: {
        countNotes: {
          orderBy: [{ measureIndex: 'asc' }, { countInMeasure: 'asc' }],
        },
      },
    });

    if (!performance) {
      return NextResponse.json({ error: 'Performance not found' }, { status: 404 });
    }

    const csv = toCSV(performance.countNotes);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${performance.name}_counts.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}
