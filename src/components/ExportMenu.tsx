'use client';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportMenuProps {
  performanceId: string;
  performanceName: string;
}

export function ExportMenu({ performanceId, performanceName }: ExportMenuProps) {
  const { toast } = useToast();

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const res = await fetch(`/api/export/${performanceId}/${format}`);
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${performanceName}_counts.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({ title: `Exported as ${format.toUpperCase()}` });
    } catch (error) {
      toast({ title: 'Export failed', description: String(error), variant: 'destructive' });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          Export JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
