import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('medibook_token')
  );
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('medibook_user');
    return u ? JSON.parse(u) : null;
  });

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('medibook_token', newToken);
    localStorage.setItem('medibook_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('medibook_token');
    localStorage.removeItem('medibook_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
