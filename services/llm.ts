import AsyncStorage from '@react-native-async-storage/async-storage';

import { SYSTEM_PROMPT as PLAN_PROMPT, buildPlanningMessage } from '@/prompts/planning';
import { SYSTEM_PROMPT as QA_PROMPT, buildQAMessage } from '@/prompts/qa';
import {
    SYSTEM_PROMPT as RECO_PROMPT,
    buildRecommendationMessage,
    type UserHistory,
} from '@/prompts/recommendations';
import { SYSTEM_PROMPT as SEARCH_PROMPT, buildSearchMessage } from '@/prompts/search';
import type { Event, EventSummary, StudentProfile } from '@/types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 1024;
const API_KEY_STORAGE = 'campusevents_apikey';

export class LLMError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'LLMError';
  }
}

async function getApiKey(): Promise<string> {
  const envKey = process.env.EXPO_PUBLIC_ANTHROPIC_KEY;
  if (envKey) {
    return envKey;
  }
  const storedKey = await AsyncStorage.getItem(API_KEY_STORAGE);
  if (storedKey) {
    return storedKey;
  }
  throw new LLMError('Missing API key', 401);
}

async function callLLM(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = await getApiKey();
  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new LLMError(err?.error?.message ?? 'API error', response.status);
    }

    const data = await response.json();
    return data.content[0].text as string;
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
  search: async (query: string, events: Event[]) => {
    const summaries = limitEventSummaries(events);
    const message = buildSearchMessage(query, summaries);
    return callLLM(SEARCH_PROMPT, message);
  },
  recommend: async (
    history: UserHistory,
    upcomingEvents: Event[],
    profile?: StudentProfile | null
  ) => {
    const summaries = limitEventSummaries(upcomingEvents);
    const message = buildRecommendationMessage(history, summaries, profile);
    return callLLM(RECO_PROMPT, message);
  },
  plan: async (constraints: string, weekEvents: Event[], profile?: StudentProfile | null) => {
    const summaries = limitEventSummaries(weekEvents);
    const message = buildPlanningMessage(constraints, summaries, profile);
    return callLLM(PLAN_PROMPT, message);
  },
  answerQuestion: async (question: string, allEvents: Event[]) => {
    const summaries = limitEventSummaries(allEvents);
    const message = buildQAMessage(question, summaries);
    return callLLM(QA_PROMPT, message);
  },
};
