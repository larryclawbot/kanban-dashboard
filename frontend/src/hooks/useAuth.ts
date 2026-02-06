import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, User, AuthResponse } from '@/lib/api';
import Cookies from 'js-cookie';

// Auth Hooks
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      Cookies.set('token', response.data.access_token, { expires: 7, path: '/' });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string; name: string }) => {
      const response = await api.post<AuthResponse>('/auth/register', data);
      Cookies.set('token', response.data.access_token, { expires: 7, path: '/' });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      Cookies.remove('token', { path: '/' });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async (): Promise<User> => {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get<User>('/users/me');
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
