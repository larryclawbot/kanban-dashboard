import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi, Card } from '@/lib/api';

export function useCards(columnId: string) {
  return useQuery({
    queryKey: ['cards', columnId],
    queryFn: () => cardsApi.getAll(columnId),
    enabled: !!columnId && typeof window !== 'undefined',
  });
}

export function useCard(id: string) {
  return useQuery({
    queryKey: ['cards', 'single', id],
    queryFn: () => cardsApi.getOne(id),
    enabled: !!id && typeof window !== 'undefined',
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      columnId: string;
      title: string;
      description?: string;
      position?: number;
      dueDate?: string;
    }) => cardsApi.create(data),
    onSuccess: (_, { columnId }) => {
      queryClient.invalidateQueries({ queryKey: ['cards', columnId] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{
        title: string;
        description: string;
        position: number;
        dueDate: string;
      }>;
    }) => cardsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['cards', 'single', id] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useMoveCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      columnId,
      position,
    }: {
      id: string;
      columnId?: string;
      position?: number;
    }) => cardsApi.move(id, { columnId, position }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}
