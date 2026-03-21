import type { AuthContext as AuthContextType } from '@/shared/type/auth.type';
import { createContext, useContext } from 'react';

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
