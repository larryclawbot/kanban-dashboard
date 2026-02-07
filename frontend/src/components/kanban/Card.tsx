'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Card as CardType } from '@/lib/api';
import { GripVertical, Calendar, Clock } from 'lucide-react';
import { useDeleteCard } from '@/hooks/useCards';
import { Button } from '@/components/ui/button';

interface KanbanCardProps {
  card: CardType;
}

export function KanbanCard({ card }: KanbanCardProps) {
  const deleteCard = useDeleteCard();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50"
      >
        <UICard className="bg-muted cursor-grabbing">
          <CardContent className="p-3">
            <div className="text-sm">{card.title}</div>
          </CardContent>
        </UICard>
      </div>
    );
  }

  return (
    <UICard
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group cursor-grab active:cursor-grabbing"
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {card.title}
          </CardTitle>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon-xs"
              {...listeners}
              className="cursor-grab"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {card.description && (
        <CardContent className="p-3 pt-2">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {card.description}
          </p>
        </CardContent>
      )}
      {(card.dueDate) && (
        <CardContent className="p-3 pt-0">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{new Date(card.dueDate).toLocaleDateString()}</span>
          </div>
        </CardContent>
      )}
    </UICard>
  );
}
