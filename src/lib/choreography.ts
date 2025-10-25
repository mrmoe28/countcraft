export interface ChoreographyCommand {
  id: string;
  count: number;
  command: string;
}

export interface ChoreographyColumn {
  id: string;
  name: string;
  commands: ChoreographyCommand[];
}

export interface ChoreographySection {
  id: string;
  name: string;
  columns: ChoreographyColumn[];
}

export function createDefaultChoreographyStructure(): ChoreographySection[] {
  return [
    {
      id: 'section-1',
      name: 'Section 1',
      columns: [
        {
          id: 'col-1-1',
          name: 'Column 1',
          commands: []
        },
        {
          id: 'col-1-2',
          name: 'Column 2',
          commands: []
        },
        {
          id: 'col-1-3',
          name: 'Column 3',
          commands: []
        },
        {
          id: 'col-1-4',
          name: 'Column 4',
          commands: []
        }
      ]
    },
    {
      id: 'section-2',
      name: 'Section 2',
      columns: [
        {
          id: 'col-2-1',
          name: 'Column 1',
          commands: []
        },
        {
          id: 'col-2-2',
          name: 'Column 2',
          commands: []
        },
        {
          id: 'col-2-3',
          name: 'Column 3',
          commands: []
        },
        {
          id: 'col-2-4',
          name: 'Column 4',
          commands: []
        }
      ]
    },
    {
      id: 'section-3',
      name: 'Section 3',
      columns: [
        {
          id: 'col-3-1',
          name: 'Column 1',
          commands: []
        },
        {
          id: 'col-3-2',
          name: 'Column 2',
          commands: []
        },
        {
          id: 'col-3-3',
          name: 'Column 3',
          commands: []
        },
        {
          id: 'col-3-4',
          name: 'Column 4',
          commands: []
        }
      ]
    }
  ];
}

export function createChoreographyFromHandwritten(): ChoreographySection[] {
  return [
    {
      id: 'section-1',
      name: 'Opening Sequence',
      columns: [
        {
          id: 'col-1-1',
          name: 'Main',
          commands: [
            { id: 'cmd-1-1-1', count: 1, command: 'head up' },
            { id: 'cmd-1-1-3', count: 3, command: 'Clean' },
            { id: 'cmd-1-1-5', count: 5, command: 'hug' },
            { id: 'cmd-1-1-7', count: 7, command: 'Hips.' }
          ]
        },
        {
          id: 'col-1-2',
          name: 'Secondary',
          commands: [
            { id: 'cmd-1-2-1', count: 1, command: 'Clean' },
            { id: 'cmd-1-2-3', count: 3, command: 'tuck' },
            { id: 'cmd-1-2-5', count: 5, command: 'move' },
            { id: 'cmd-1-2-8', count: 8, command: 'move' }
          ]
        },
        {
          id: 'col-1-3',
          name: 'Tertiary',
          commands: [
            { id: 'cmd-1-3-1', count: 1, command: 'Clean' },
            { id: 'cmd-1-3-3', count: 3, command: 'Cone' },
            { id: 'cmd-1-3-5', count: 5, command: 'Go' },
            { id: 'cmd-1-3-8', count: 8, command: 'Move' }
          ]
        },
        {
          id: 'col-1-4',
          name: 'Support',
          commands: [
            { id: 'cmd-1-4-1', count: 1, command: 'move' },
            { id: 'cmd-1-4-5', count: 5, command: 'Clean' },
            { id: 'cmd-1-4-6', count: 6, command: 'Fast' },
            { id: 'cmd-1-4-8', count: 8, command: 'dup' }
          ]
        }
      ]
    },
    {
      id: 'section-2',
      name: 'Build Sequence',
      columns: [
        {
          id: 'col-2-1',
          name: 'Main',
          commands: [
            { id: 'cmd-2-1-1', count: 1, command: 'up' },
            { id: 'cmd-2-1-3', count: 3, command: 'High V' },
            { id: 'cmd-2-1-5', count: 5, command: 'wrist' },
            { id: 'cmd-2-1-7', count: 7, command: 'Down' }
          ]
        },
        {
          id: 'col-2-2',
          name: 'Secondary',
          commands: [
            { id: 'cmd-2-2-1', count: 1, command: 'move' },
            { id: 'cmd-2-2-5', count: 5, command: 'Big Stunt (Clean)' },
            { id: 'cmd-2-2-7', count: 7, command: 'Foot' },
            { id: 'cmd-2-2-8', count: 8, command: 'dup' }
          ]
        },
        {
          id: 'col-2-3',
          name: 'Tertiary',
          commands: [
            { id: 'cmd-2-3-1', count: 1, command: 'up' },
            { id: 'cmd-2-3-3', count: 3, command: 'Hiv' },
            { id: 'cmd-2-3-5', count: 5, command: 'touch (Pyramid)' },
            { id: 'cmd-2-3-7', count: 7, command: 'Wrist' }
          ]
        },
        {
          id: 'col-2-4',
          name: 'Support',
          commands: [
            { id: 'cmd-2-4-1', count: 1, command: 'teddy Bear' },
            { id: 'cmd-2-4-3', count: 3, command: 'turn' },
            { id: 'cmd-2-4-5', count: 5, command: 'Feet' },
            { id: 'cmd-2-4-7', count: 7, command: 'Base move (tumble)' }
          ]
        }
      ]
    },
    {
      id: 'section-3',
      name: 'Finale Sequence',
      columns: [
        {
          id: 'col-3-1',
          name: 'Main',
          commands: [
            { id: 'cmd-3-1-1', count: 1, command: 'move to jumps/leaps!' },
            { id: 'cmd-3-1-3', count: 3, command: 'Clean' },
            { id: 'cmd-3-1-7', count: 7, command: 'Jump' }
          ]
        },
        {
          id: 'col-3-2',
          name: 'Secondary',
          commands: [
            { id: 'cmd-3-2-1', count: 1, command: 'turn Clean' },
            { id: 'cmd-3-2-3', count: 3, command: 'Ceasp' },
            { id: 'cmd-3-2-5', count: 5, command: 'jump' },
            { id: 'cmd-3-2-8', count: 8, command: 'Clean' }
          ]
        },
        {
          id: 'col-3-3',
          name: 'Tertiary',
          commands: [
            { id: 'cmd-3-3-1', count: 1, command: 'Tumbling (move)' },
            { id: 'cmd-3-3-3', count: 3, command: 'Wave' },
            { id: 'cmd-3-3-5', count: 5, command: 'Blowkiss' },
            { id: 'cmd-3-3-7', count: 7, command: 'Clean' }
          ]
        },
        {
          id: 'col-3-4',
          name: 'Support',
          commands: [
            { id: 'cmd-3-4-1', count: 1, command: 'Go' },
            { id: 'cmd-3-4-3', count: 3, command: 'Clean' },
            { id: 'cmd-3-4-4', count: 4, command: 'Go' },
            { id: 'cmd-3-4-7', count: 7, command: 'Clean' },
            { id: 'cmd-3-4-8', count: 8, command: 'Go' }
          ]
        }
      ]
    }
  ];
}
