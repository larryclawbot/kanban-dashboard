import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCreateBoard } from '@/hooks/useBoards';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const boardSchema = z.object({
  name: z.string().min(1, 'Board name is required'),
  description: z.string().optional(),
});

type BoardFormData = z.infer<typeof boardSchema>;

interface BoardCardProps {
  board: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
  };
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Link href={`/boards/${board.id}`}>
      <Card className="h-full cursor-pointer hover:border-primary transition-colors">
        <CardHeader>
          <CardTitle className="line-clamp-1">{board.name}</CardTitle>
          {board.description && (
            <CardDescription className="line-clamp-2">
              {board.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(board.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CreateBoardCard() {
  const [isCreating, setIsCreating] = useState(false);
  const createBoard = useCreateBoard();

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: BoardFormData) => {
    try {
      await createBoard.mutateAsync(data);
      setIsCreating(false);
      form.reset();
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  if (!isCreating) {
    return (
      <Card className="h-full cursor-pointer hover:border-primary transition-colors border-dashed">
        <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="flex flex-col gap-2 h-auto py-4"
          >
            <Plus className="h-8 w-8" />
            <span>Create New Board</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Create New Board</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Board" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Board description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
      </CardContent>
    </Card>
  );
}
