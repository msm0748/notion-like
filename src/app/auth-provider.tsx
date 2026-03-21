import { AuthContext } from '@/entities/auth';
import type { AuthDto } from '@/shared/type/auth.type';
import supabase from '@/shared/utils/supabase';
import { useEffect, useState } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUser(data.user?.user_metadata as AuthDto);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
