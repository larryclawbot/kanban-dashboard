'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, User, AuthResponse } from '@/lib/api';
import Cookies from 'js-cookie';
import { useLogin as useLoginMutation, useRegister as useRegisterMutation, useLogout as useLogoutMutation } from '@/hooks/useAuth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Load token and user on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get('token');
      if (savedToken) {
        setToken(savedToken);
        try {
          const response = await api.get<User>('/users/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          setUser(response.data);
        } catch {
          // Token invalid, clear it
          Cookies.remove('token', { path: '/' });
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  const login = async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    const newToken = Cookies.get('token');
    setToken(newToken || result.access_token);
    setUser(result.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await registerMutation.mutateAsync({ email, password, name });
    const newToken = Cookies.get('token');
    setToken(newToken || result.access_token);
    setUser(result.user);
  };

  const logout = () => {
    logoutMutation.mutateAsync();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user && !loading;

  return (
    <AuthContext.Provider
      value={{
        user: isAuthenticated ? user : null,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
