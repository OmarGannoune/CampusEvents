import { useAI } from '@/context/AIContext';

type UseLLMResult = {
  isAIBusy: boolean;
  setAIBusy: (value: boolean) => void;
};

export function useLLM(): UseLLMResult {
  const { isAIBusy, setAIBusy } = useAI();
  return { isAIBusy, setAIBusy };
}
