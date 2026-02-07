import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { columnsApi, Column } from '@/lib/api';

export function useColumns(boardId: string) {
  return useQuery({
    queryKey: ['columns', boardId],
    queryFn: () => columnsApi.getAll(boardId),
    enabled: !!boardId && typeof window !== 'undefined',
  });
}

export function useColumn(id: string) {
  return useQuery({
    queryKey: ['columns', 'single', id],
    queryFn: () => columnsApi.getOne(id),
    enabled: !!id && typeof window !== 'undefined',
  });
}

export function useCreateColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { boardId: string; name: string; position?: number }) =>
      columnsApi.create(data),
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
    },
  });
}

export function useUpdateColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ name: string; position: number }>;
    }) => columnsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['columns'] });
      queryClient.invalidateQueries({ queryKey: ['columns', 'single', id] });
    },
  });
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => columnsApi.delete(id),
    onSuccess: (_, boardId) => {
      queryClient.invalidateQueries({ queryKey: ['columns', boardId] });
    },
  });
}

export function useMoveColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, position }: { id: string; position: number }) =>
      columnsApi.move(id, { position }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] });
    },
  });
}
