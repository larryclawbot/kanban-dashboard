'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useColumns } from '@/hooks/useColumns';
import { useCards } from '@/hooks/useCards';
import { useBoards } from '@/hooks/useBoards';
import { Board } from '@/components/kanban/Board';

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const boardId = params.id as string;
  const [mounted, setMounted] = useState(false);

  const { data: board, isLoading: boardLoading } = useBoards();
  const { data: columns, isLoading: columnsLoading } = useColumns(boardId);
  const { data: cards, isLoading: cardsLoading } = useCards(boardId);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (mounted && boardId && board) {
      const boardExists = board.some((b) => b.id === boardId);
      if (!boardExists) {
        router.push('/my-boards');
      }
    }
  }, [mounted, boardId, board, router]);

  if (!mounted || authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Loading...</div>
      </div>
    );
  }

  if (boardLoading || columnsLoading || cardsLoading || columns === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Loading board...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Board
        boardId={boardId}
        columns={columns}
        cards={cards || []}
        isLoading={false}
      />
    </div>
  );
}
