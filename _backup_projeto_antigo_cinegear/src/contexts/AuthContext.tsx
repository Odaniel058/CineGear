import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  company: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, company: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('cinegear_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login
    const u: User = { id: '1', email, name: 'Administrador', company: 'Minha Locadora' };
    localStorage.setItem('cinegear_user', JSON.stringify(u));
    setUser(u);
  }, []);

  const signup = useCallback(async (name: string, company: string, email: string, _password: string) => {
    const u: User = { id: '1', email, name, company };
    localStorage.setItem('cinegear_user', JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cinegear_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
