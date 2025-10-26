'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save } from 'lucide-react';

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

interface ChoreographyGridProps {
  sections: ChoreographySection[];
  onUpdate?: (sections: ChoreographySection[]) => void;
}

export default function ChoreographyGrid({ sections, onUpdate }: ChoreographyGridProps) {
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

  const hasCommandForCount = (sectionId: string, columnId: string, count: number) => {
    return getCommandsForCount(sectionId, columnId, count).length > 0;
  };

  return (
    <div className="space-y-6">
      {localSections.map((section, sectionIndex) => (
        <Card key={section.id} className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-center">
              {section.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {section.columns.map((column, columnIndex) => (
                <div key={column.id} className="space-y-2">
                  <Label className="text-sm font-medium text-center block">
                    {column.name}
                  </Label>
                  
                  {/* 8-Count Grid */}
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(count => {
                      const commands = getCommandsForCount(section.id, column.id, count);
                      const hasCommand = hasCommandForCount(section.id, column.id, count);
                      
                      return (
                        <div key={count} className="flex items-center gap-1">
                          <div className="w-6 h-8 flex items-center justify-center text-xs font-bold text-gray-600 bg-gray-100 rounded border">
                            {count}
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            {commands.map((command, cmdIndex) => (
                              <div key={command.id} className="flex items-center gap-1">
                                <Input
                                  value={command.command}
                                  onChange={(e) => updateCommand(section.id, column.id, command.id, e.target.value)}
                                  placeholder={`Count ${count} command`}
                                  className="h-8 text-sm"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeCommand(section.id, column.id, command.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            
                            {!hasCommand && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addCommand(section.id, column.id, count)}
                                className="h-8 w-full text-gray-400 hover:text-gray-600 border-2 border-dashed border-gray-300 hover:border-gray-400"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add command
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
