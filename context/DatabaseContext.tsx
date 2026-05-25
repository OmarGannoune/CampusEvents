import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { initDatabase } from '@/database/init';
import { seedDatabase } from '@/database/seed';

type DatabaseContextValue = {
  isReady: boolean;
};

const DatabaseContext = createContext<DatabaseContextValue | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initDatabase();
    seedDatabase();
    setIsReady(true);
  }, []);

  const value = useMemo(() => ({ isReady }), [isReady]);

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase(): DatabaseContextValue {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within DatabaseProvider');
  }
  return context;
}
