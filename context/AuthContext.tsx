import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { User } from '@/services/auth';
import { clearSession, readSession, validateCredentials, writeSession } from '@/services/auth';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<'success' | 'invalid_credentials'>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    readSession()
      .then((session) => {
        if (isMounted) {
          setUser(session);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const session = await validateCredentials(email.trim(), password);
    if (!session) {
      return 'invalid_credentials' as const;
    }
    await writeSession(session);
    setUser(session);
    return 'success' as const;
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
