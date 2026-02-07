'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useBoards, useCreateBoard, useDeleteBoard } from '@/hooks/useBoards';
import { BoardCard } from '@/components/kanban/BoardCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Layout } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';

const boardSchema = z.object({
  name: z.string().min(1, 'Board name is required'),
  description: z.string().optional(),
});

type BoardFormData = z.infer<typeof boardSchema>;

export default function BoardsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const { data: boards, isLoading } = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: BoardFormData) => {
    try {
      const newBoard = await createBoard.mutateAsync({
        name: data.name,
        description: data.description,
      });
      setIsCreating(false);
      form.reset();
      router.push(`/boards/${newBoard.id}`);
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBoard.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete board:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading boards...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Boards</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your kanban boards
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="mb-8 p-4 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Create New Board</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  placeholder="Board name"
                  {...form.register('name')}
                  autoFocus
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  placeholder="Description (optional)"
                  {...form.register('description')}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createBoard.isPending}>
                  {createBoard.isPending ? 'Creating...' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {boards && boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onDelete={() => handleDelete(board.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No boards yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first board to get started
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Board
          </Button>
        </div>
      )}
    </div>
  );
}
