'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import { Column as ColumnType, Card as CardType } from '@/lib/api';
import { KanbanCard } from './Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Plus, GripVertical, Trash2, MoreHorizontal } from 'lucide-react';
import { useCreateCard, useDeleteColumn, useUpdateColumn } from '@/hooks/useColumns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const cardSchema = z.object({
  title: z.string().min(1, 'Card title is required'),
  description: z.string().optional(),
});

type CardFormData = z.infer<typeof cardSchema>;

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
}

export function KanbanColumn({ column, cards }: ColumnProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const createCard = useCreateCard();
  const updateColumn = useUpdateColumn();
  const deleteColumn = useDeleteColumn();

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const editForm = useForm({
    defaultValues: {
      name: column.name,
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onAddCard = async (data: CardFormData) => {
    try {
      await createCard.mutateAsync({
        columnId: column.id,
        title: data.title,
        description: data.description,
        position: cards.length,
      });
      setIsAddingCard(false);
      form.reset();
    } catch (error) {
      console.error('Failed to add card:', error);
    }
  };

  const onUpdateName = async (name: string) => {
    try {
      await updateColumn.mutateAsync({
        id: column.id,
        data: { name },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update column:', error);
    }
  };

  const onDeleteColumn = async () => {
    try {
      await deleteColumn.mutateAsync(column.id);
    } catch (error) {
      console.error('Failed to delete column:', error);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-[300px] h-[500px] bg-muted rounded-lg opacity-50 border-2 border-dashed border-primary"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[300px] flex flex-col bg-gray-100 dark:bg-gray-800 rounded-lg max-h-full"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b bg-white dark:bg-gray-900 rounded-t-lg">
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="icon-xs"
            {...attributes}
            {...listeners}
            className="cursor-grab"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          {isEditing ? (
            <Input
              {...editForm.register('name')}
              defaultValue={column.name}
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  onUpdateName(e.target.value);
                } else {
                  setIsEditing(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = editForm.getValues('name');
                  if (value.trim()) {
                    onUpdateName(value);
                  }
                }
                if (e.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
              className="h-7 text-sm font-medium"
              autoFocus
            />
          ) : (
            <h3
              className="font-medium text-sm cursor-pointer hover:text-primary"
              onClick={() => setIsEditing(true)}
            >
              {column.name}
            </h3>
          )}
          <span className="text-xs text-muted-foreground bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
            {cards.length}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDeleteColumn} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      {/* Add Card Button */}
      {isAddingCard ? (
        <div className="p-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddCard)} className="space-y-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Card Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Card title"
                        {...field}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setIsAddingCard(false);
                            form.reset();
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Description (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Description (optional)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={createCard.isPending}>
                  {createCard.isPending ? 'Adding...' : 'Add Card'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingCard(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingCard(true)}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>
      )}
    </div>
  );
}
