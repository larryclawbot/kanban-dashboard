import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export const authApi = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password, name });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },
};

export const boardsApi = {
  getAll: async () => {
    const { data } = await api.get('/boards');
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get(`/boards/${id}`);
    return data;
  },

  create: async (board: { name: string; description?: string }) => {
    const { data } = await api.post('/boards', board);
    return data;
  },

  update: async (id: string, board: Partial<{ name: string; description: string }>) => {
    const { data } = await api.put(`/boards/${id}`, board);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/boards/${id}`);
    return data;
  },
};

export interface Column {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export const columnsApi = {
  getAll: async (boardId: string) => {
    const { data } = await api.get('/columns', { params: { boardId } });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get(`/columns/${id}`);
    return data;
  },

  create: async (column: { boardId: string; name: string; position?: number }) => {
    const { data } = await api.post('/columns', column);
    return data;
  },

  update: async (id: string, column: Partial<{ name: string; position: number }>) => {
    const { data } = await api.put(`/columns/${id}`, column);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/columns/${id}`);
    return data;
  },

  move: async (id: string, data: { position: number }) => {
    const response = await api.put(`/columns/${id}/move`, data);
    return response.data;
  },
};

export interface Card {
  id: string;
  title: string;
  description?: string;
  position: number;
  columnId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const cardsApi = {
  getAll: async (columnId: string) => {
    const { data } = await api.get('/cards', { params: { columnId } });
    return data;
  },

  getOne: async (id: string) => {
    const { data } = await api.get(`/cards/${id}`);
    return data;
  },

  create: async (card: { columnId: string; title: string; description?: string; position?: number; dueDate?: string }) => {
    const { data } = await api.post('/cards', card);
    return data;
  },

  update: async (id: string, card: Partial<{ title: string; description: string; position: number; dueDate: string }>) => {
    const { data } = await api.put(`/cards/${id}`, card);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/cards/${id}`);
    return data;
  },

  move: async (id: string, data: { columnId?: string; position?: number }) => {
    const response = await api.put(`/cards/${id}/move`, data);
    return response.data;
  },
};
