import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../api/client';
import type { AppUser } from '../api/client';

type UserRole = 'guest' | 'student' | 'admin';

interface AuthContextType {
  user: AppUser | null;
  role: UserRole;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, inviteCode?: string) => Promise<void>;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Восстанавливаем сессию из localStorage при загрузке
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { localStorage.removeItem('user'); }
    }
  }, []);

  const role: UserRole = user?.role ?? 'guest';

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setIsLoginModalOpen(false);
  };

  const register = async (name: string, email: string, password: string, inviteCode?: string) => {
    const data = await api.register(name, email, password, inviteCode);
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      login,
      register,
      logout,
      isLoginModalOpen,
      openLoginModal: () => setIsLoginModalOpen(true),
      closeLoginModal: () => setIsLoginModalOpen(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
