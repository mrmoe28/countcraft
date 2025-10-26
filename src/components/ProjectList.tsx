'use client';

import { Performance } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDuration } from '@/lib/time';

interface ProjectListProps {
  performances: (Performance & { track?: { durationSec: number } | null })[];
}

export function ProjectList({ performances }: ProjectListProps) {
  if (performances.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No performances yet</p>
          <Button asChild>
            <Link href="/performance/new">Create Your First Performance</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {performances.map(perf => (
        <Link key={perf.id} href={`/performance/${perf.id}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{perf.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {perf.team && (
                <p className="text-sm text-muted-foreground">{perf.team}</p>
              )}
              {perf.track && (
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDuration(perf.track.durationSec)}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
