'use client';

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useMemo } from 'react';
import { Column as ColumnType, Card as CardType } from '@/lib/api';
import { KanbanColumn } from './Column';
import { KanbanCard } from './Card';
import { ColumnList } from './ColumnList';
import { useMoveColumn, useMoveCard } from '@/hooks/useColumns';
import { useQueryClient } from '@tanstack/react-query';

interface BoardProps {
  boardId: string;
  columns: ColumnType[];
  cards: CardType[];
  isLoading: boolean;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export function Board({ boardId, columns, cards, isLoading }: BoardProps) {
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const moveColumn = useMoveColumn();
  const moveCard = useMoveCard();
  const queryClient = useQueryClient();

  // Organize cards by column
  const cardsByColumn = useMemo(() => {
    const result: Record<string, CardType[]> = {};
    columns.forEach((col) => {
      result[col.id] = [];
    });
    cards.forEach((card) => {
      if (result[card.columnId]) {
        result[card.columnId].push(card);
      }
    });
    // Sort cards by position within each column
    Object.keys(result).forEach((colId) => {
      result[colId].sort((a, b) => a.position - b.position);
    });
    return result;
  }, [columns, cards]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type;
    const data = active.data.current;

    if (type === 'Column') {
      setActiveColumn(data.column);
    } else if (type === 'Card') {
      setActiveCard(data.card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If dragging a card over a column (empty or not)
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Handle card over another column
    if (activeType === 'Card') {
      const activeCard = active.data.current?.card as CardType;
      const overColumnId = overType === 'Column' ? overId : over.data.current?.sortable?.containerId;
      
      if (overColumnId && activeCard.columnId !== overColumnId) {
        // Optimistic update for card moving between columns
        const newCardsByColumn = { ...cardsByColumn };
        
        // Remove from old column
        const oldColumnCards = [...(newCardsByColumn[activeCard.columnId] || [])];
        const cardIndex = oldColumnCards.findIndex(c => c.id === activeId);
        if (cardIndex > -1) {
          oldColumnCards.splice(cardIndex, 1);
          newCardsByColumn[activeCard.columnId] = oldColumnCards;
        }
        
        // Add to new column
        const newColumnCards = [...(newCardsByColumn[overColumnId] || [])];
        const overIndex = over.data.current?.sortable?.index ?? newColumnCards.length;
        const newCard = { ...activeCard, columnId: overColumnId as string };
        newColumnCards.splice(overIndex, 0, newCard);
        newCardsByColumn[overColumnId] = newColumnCards;
        
        // We can't update state here since cardsByColumn is derived from props
        // The optimistic update will happen on drag end
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Handle column reordering
    if (activeType === 'Column' && overType === 'Column') {
      const oldIndex = columns.findIndex((c) => c.id === activeId);
      const newIndex = columns.findIndex((c) => c.id === overId);

      if (oldIndex !== newIndex) {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        
        // Optimistic update
        await moveColumn.mutateAsync({
          id: activeId as string,
          position: newIndex,
        });
      }
    }

    // Handle card reordering
    if (activeType === 'Card' && overType === 'Card') {
      const activeCard = active.data.current?.card as CardType;
      const overCard = over.data.current?.card as CardType;

      const oldColumnId = activeCard.columnId;
      const newColumnId = overCard.columnId;
      
      const oldColumnCards = cardsByColumn[oldColumnId] || [];
      const newColumnCards = cardsByColumn[newColumnId] || [];

      const oldIndex = oldColumnCards.findIndex((c) => c.id === activeId);
      let newIndex = newColumnCards.findIndex((c) => c.id === overId);

      if (oldColumnId === newColumnId) {
        // Same column - reorder
        if (oldIndex !== newIndex) {
          const newCards = arrayMove(oldColumnCards, oldIndex, newIndex);
          
          await moveCard.mutateAsync({
            id: activeId as string,
            position: newIndex,
          });
        }
      } else {
        // Different column - move to new column
        // newIndex might be undefined if dropping on a column directly
        newIndex = newIndex >= 0 ? newIndex : newColumnCards.length;

        await moveCard.mutateAsync({
          id: activeId as string,
          columnId: newColumnId,
          position: newIndex,
        });
      }
    }

    // Handle card dropped on column
    if (activeType === 'Card' && overType === 'Column') {
      const activeCard = active.data.current?.card as CardType;
      const overColumnId = overId as string;

      if (activeCard.columnId !== overColumnId) {
        const columnCards = cardsByColumn[overColumnId] || [];
        const newIndex = columnCards.length;

        await moveCard.mutateAsync({
          id: activeId as string,
          columnId: overColumnId,
          position: newIndex,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading board...</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full overflow-x-auto">
        <ColumnList
          boardId={boardId}
          columns={columns}
          cards={cardsByColumn}
          onAddColumn={() => {
            queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
          }}
        />
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeColumn && (
          <div className="w-[300px] opacity-80">
            <KanbanColumn
              column={activeColumn}
              cards={cardsByColumn[activeColumn.id] || []}
            />
          </div>
        )}
        {activeCard && (
          <div className="opacity-80 rotate-3 cursor-grabbing">
            <KanbanCard card={activeCard} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
