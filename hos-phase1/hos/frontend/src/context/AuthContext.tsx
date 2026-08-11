import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, Role } from '../types';
import { login as loginRequest } from '../services/authService';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (role: Role, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('hos_user');
    const storedToken = localStorage.getItem('hos_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  async function login(role: Role, email: string, password: string) {
    const { token, user: loggedInUser } = await loginRequest(role, email, password);
    localStorage.setItem('hos_token', token);
    localStorage.setItem('hos_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }

  function logout() {
    localStorage.removeItem('hos_token');
    localStorage.removeItem('hos_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
