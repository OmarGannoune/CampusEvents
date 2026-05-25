import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

type AIContextValue = {
  isAIBusy: boolean;
  setAIBusy: (value: boolean) => void;
};

const AIContext = createContext<AIContextValue | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [isAIBusy, setAIBusy] = useState(false);

  const value = useMemo(
    () => ({
      isAIBusy,
      setAIBusy,
    }),
    [isAIBusy]
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI(): AIContextValue {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
}
