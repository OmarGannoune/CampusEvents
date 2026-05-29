import { getLatestResult, saveResult } from '@/database/llmResults';
import { SYSTEM_PROMPT as PLAN_PROMPT, buildPlanningMessage } from '@/prompts/planning';
import { SYSTEM_PROMPT as QA_PROMPT, buildQAMessage } from '@/prompts/qa';
import {
    SYSTEM_PROMPT as RECO_PROMPT,
    buildRecommendationMessage,
    type UserHistory,
} from '@/prompts/recommendations';
import { SYSTEM_PROMPT as SEARCH_PROMPT, buildSearchMessage } from '@/prompts/search';
import type { Event, EventSummary, LLMResultType, StudentProfile } from '@/types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 1024;

export class LLMError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'LLMError';
  }
}

async function getApiKey(): Promise<string> {
  const envKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (envKey) {
    return envKey;
  }
  // Hardcoded fallback for the academic project
  return 'gsk_YOUR_GROQ_API_KEY_HERE';
}

async function callLLM(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = await getApiKey();
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new LLMError(err?.error?.message ?? 'API error', response.status);
    }

    const data = await response.json();
    return data.choices[0].message.content as string;
  } catch (error) {
    if (error instanceof LLMError) {
      throw error;
    }
    throw new LLMError('Network error', 0);
  }
}

function truncateDescription(value: string): string {
  if (value.length <= 200) {
    return value;
  }
  return value.slice(0, 200);
}

function toEventSummary(event: Event): EventSummary {
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    startDateTime: event.startDateTime,
    locationName: event.locationName,
    capacity: event.capacity,
    registeredCount: event.registeredCount,
    tags: event.tags,
    description: truncateDescription(event.description),
  };
}

function limitEventSummaries(events: Event[]): EventSummary[] {
  let summaries = events.map(toEventSummary).slice(0, 20);
  let serialized = JSON.stringify(summaries);
  while (serialized.length > 6000 && summaries.length > 0) {
    summaries = summaries.slice(0, -1);
    serialized = JSON.stringify(summaries);
  }
  return summaries;
}

export const llmService = {
  search: async (userId: string, query: string, events: Event[]) => {
    const cached = getLatestResult(userId, 'search', query);
    if (cached) return cached.outputText;

    const summaries = limitEventSummaries(events);
    const message = buildSearchMessage(query, summaries);
    const response = await callLLM(SEARCH_PROMPT, message);
    saveResult({ userId, type: 'search', inputText: query, outputText: response });
    return response;
  },
  recommend: async (
    userId: string,
    history: UserHistory,
    upcomingEvents: Event[],
    profile?: StudentProfile | null
  ) => {
    const inputText = JSON.stringify(history);
    const cached = getLatestResult(userId, 'recommendation', inputText);
    if (cached) return cached.outputText;

    const summaries = limitEventSummaries(upcomingEvents);
    const message = buildRecommendationMessage(history, summaries, profile);
    const response = await callLLM(RECO_PROMPT, message);
    saveResult({ userId, type: 'recommendation', inputText, outputText: response });
    return response;
  },
  plan: async (userId: string, constraints: string, weekEvents: Event[], profile?: StudentProfile | null) => {
    const cached = getLatestResult(userId, 'planning', constraints);
    if (cached) return cached.outputText;

    const summaries = limitEventSummaries(weekEvents);
    const message = buildPlanningMessage(constraints, summaries, profile);
    const response = await callLLM(PLAN_PROMPT, message);
    saveResult({ userId, type: 'planning', inputText: constraints, outputText: response });
    return response;
  },
  answerQuestion: async (userId: string, question: string, allEvents: Event[]) => {
    const cached = getLatestResult(userId, 'qa', question);
    if (cached) return cached.outputText;

    const summaries = limitEventSummaries(allEvents);
    const message = buildQAMessage(question, summaries);
    const response = await callLLM(QA_PROMPT, message);
    saveResult({ userId, type: 'qa', inputText: question, outputText: response });
    return response;
  },
};
