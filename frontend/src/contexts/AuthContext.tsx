'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useLogin as useLoginMutation, useRegister as useRegisterMutation, useLogout as useLogoutMutation } from '@/hooks/useAuth';
import { User } from '@/lib/api';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const { data: user, isLoading: userLoading, error } = useUser();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    const savedToken = Cookies.get('token') || null;
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string, name: string) => {
    await registerMutation.mutateAsync({ email, password, name });
  };

  const logout = () => {
    logoutMutation.mutateAsync();
    setToken(null);
  };

  // If user query has error (no token/invalid), treat as logged out
  const isLoggedOut = !!error || (!token && !userLoading);

  return (
    <AuthContext.Provider
      value={{
        user: isLoggedOut ? null : (user || null),
        token,
        login,
        register,
        logout,
        loading: userLoading || loginMutation.isPending || registerMutation.isPending,
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
