'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function PerformanceForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/performances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          team: team || undefined,
          eventDate: eventDate || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create performance');

      const data = await res.json();
      toast({ title: 'Performance created!' });
      router.push(`/performance/${data.id}`);
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="team">Team</Label>
            <Input
              id="team"
              value={team}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTeam(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDate(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading || !name} className="w-full">
            {loading ? 'Creating...' : 'Create Performance'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
