'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ChoreographyCommand {
  id: string;
  count: number;
  command: string;
}

interface ChoreographySection {
  id: string;
  name: string;
  columns: {
    id: string;
    name: string;
    commands: ChoreographyCommand[];
  }[];
}

interface CompactChoreographyGridProps {
  sections: ChoreographySection[];
  onUpdate?: (sections: ChoreographySection[]) => void;
}

export default function CompactChoreographyGrid({ sections, onUpdate }: CompactChoreographyGridProps) {
  const [localSections, setLocalSections] = useState<ChoreographySection[]>(sections);

  const updateCommand = (sectionId: string, columnId: string, commandId: string, newCommand: string) => {
    const updatedSections = localSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          columns: section.columns.map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                commands: column.commands.map(cmd => 
                  cmd.id === commandId ? { ...cmd, command: newCommand } : cmd
                )
              };
            }
            return column;
          })
        };
      }
      return section;
    });
    
    setLocalSections(updatedSections);
    onUpdate?.(updatedSections);
  };

  const addCommand = (sectionId: string, columnId: string, count: number) => {
    const newCommand: ChoreographyCommand = {
      id: `${Date.now()}-${Math.random()}`,
      count,
      command: ''
    };

    const updatedSections = localSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          columns: section.columns.map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                commands: [...column.commands, newCommand].sort((a, b) => a.count - b.count)
              };
            }
            return column;
          })
        };
      }
      return section;
    });
    
    setLocalSections(updatedSections);
    onUpdate?.(updatedSections);
  };

  const removeCommand = (sectionId: string, columnId: string, commandId: string) => {
    const updatedSections = localSections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          columns: section.columns.map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                commands: column.commands.filter(cmd => cmd.id !== commandId)
              };
            }
            return column;
          })
        };
      }
      return section;
    });
    
    setLocalSections(updatedSections);
    onUpdate?.(updatedSections);
  };

  const getCommandsForCount = (sectionId: string, columnId: string, count: number) => {
    const section = localSections.find(s => s.id === sectionId);
    const column = section?.columns.find(c => c.id === columnId);
    return column?.commands.filter(cmd => cmd.count === count) || [];
  };

  return (
    <div className="space-y-4">
      {localSections.map((section, sectionIndex) => (
        <Card key={section.id} className="border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-center">
              {section.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-4 gap-3">
              {section.columns.map((column, columnIndex) => (
                <div key={column.id} className="space-y-1">
                  {/* 8-Count Grid - Compact Version */}
                  <div className="space-y-0.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(count => {
                      const commands = getCommandsForCount(section.id, column.id, count);
                      
                      return (
                        <div key={count} className="flex items-center gap-1">
                          {/* Count Number */}
                          <div className="w-5 h-6 flex items-center justify-center text-xs font-bold text-gray-600 bg-gray-50 rounded border text-center">
                            {count}
                          </div>
                          
                          {/* Commands */}
                          <div className="flex-1 space-y-0.5">
                            {commands.map((command, cmdIndex) => (
                              <div key={command.id} className="flex items-center gap-1">
                                <Input
                                  value={command.command}
                                  onChange={(e) => updateCommand(section.id, column.id, command.id, e.target.value)}
                                  placeholder=""
                                  className="h-6 text-xs px-2 py-1"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeCommand(section.id, column.id, command.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-2 w-2" />
                                </Button>
                              </div>
                            ))}
                            
                            {commands.length === 0 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addCommand(section.id, column.id, count)}
                                className="h-6 w-full text-gray-400 hover:text-gray-600 border border-dashed border-gray-300 hover:border-gray-400 text-xs"
                              >
                                <Plus className="h-2 w-2 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
