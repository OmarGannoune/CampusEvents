import type { LLMResult, LLMResultType } from '@/types';

import { generateId } from '@/utils/ids';
import { db } from './init';

export function saveResult(data: Omit<LLMResult, 'id' | 'createdAt'>): LLMResult {
  const result: LLMResult = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  db.runSync(
    'INSERT INTO llm_results (id, eventId, userId, type, inputText, outputText, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    result.id,
    result.eventId ?? null,
    result.userId,
    result.type,
    result.inputText,
    result.outputText,
    result.createdAt
  );
  return result;
}

export function getLatestResult(
  userId: string,
  type: LLMResultType,
  inputText: string
): LLMResult | null {
  const row = db.getFirstSync<LLMResult>(
    `SELECT * FROM llm_results
     WHERE userId = ? AND type = ? AND inputText = ?
     ORDER BY createdAt DESC
     LIMIT 1`,
    userId,
    type,
    inputText
  );
  return row ?? null;
}
