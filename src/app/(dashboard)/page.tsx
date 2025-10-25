import { prisma } from '@/lib/db';
import { ProjectList } from '@/components/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DashboardPage() {
  const performances = await prisma.performance.findMany({
    include: {
      track: {
        select: {
          durationSec: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">CountCraft</h1>
        <Button asChild>
          <Link href="/performance/new">New Performance</Link>
        </Button>
      </div>
      <ProjectList performances={performances} />
    </div>
  );
}
