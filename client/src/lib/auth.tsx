import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

interface User { id: string; email: string; username: string; role: string; }
interface AuthCtx { user: User | null; loading: boolean; login: (email: string, pass: string) => Promise<void>; register: (email: string, username: string, pass: string) => Promise<void>; logout: () => void; }

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me').then(r => setUser(r.data)).catch(() => localStorage.removeItem('token'));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const r = await api.post('/auth/login', { email, password: pass });
    localStorage.setItem('token', r.data.token);
    setUser(r.data.user);
  };

  const register = async (email: string, username: string, pass: string) => {
    const r = await api.post('/auth/register', { email, username, password: pass });
    localStorage.setItem('token', r.data.token);
    setUser(r.data.user);
  };

  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
