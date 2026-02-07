'use client';

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import { Column as ColumnType, Card as CardType } from '@/lib/api';
import { KanbanColumn } from './Column';
import { useCreateColumn, useColumns } from '@/hooks/useColumns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';

const columnSchema = z.object({
  name: z.string().min(1, 'Column name is required'),
});

type ColumnFormData = z.infer<typeof columnSchema>;

interface ColumnListProps {
  boardId: string;
  columns: ColumnType[];
  cards: Record<string, CardType[]>;
  onAddColumn: () => void;
}

export function ColumnList({
  boardId,
  columns = [],
  cards = {},
  onAddColumn,
}: ColumnListProps) {
  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full min-h-[200px]">
      <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
        {columns
          .sort((a, b) => a.position - b.position)
          .map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cards[column.id] || []}
            />
          ))}
      </SortableContext>
      <AddColumnButton boardId={boardId} onAdd={onAddColumn} />
    </div>
  );
}

interface AddColumnButtonProps {
  boardId: string;
  onAdd: () => void;
}

function AddColumnButton({ boardId, onAdd }: AddColumnButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const createColumn = useCreateColumn();
  const { columns } = useColumns(boardId);
  
  const form = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: ColumnFormData) => {
    try {
      await createColumn.mutateAsync({
        boardId,
        name: data.name,
        position: (columns?.data?.length || 0),
      });
      setIsAdding(false);
      form.reset();
      onAdd();
    } catch (error) {
      console.error('Failed to add column:', error);
    }
  };

  if (!isAdding) {
    return (
      <div className="w-[300px] flex-shrink-0">
        <Button
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full h-[50px] border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Column
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[300px] flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <Input
            placeholder="Column name"
            {...form.register('name')}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsAdding(false);
                form.reset();
              }
            }}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={createColumn.isPending}>
              {createColumn.isPending ? 'Adding...' : 'Add'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
