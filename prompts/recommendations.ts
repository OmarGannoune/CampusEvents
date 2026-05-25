import type { EventSummary } from '@/types';

export const SYSTEM_PROMPT = `
You are a personalised university event recommendation engine.
You receive a student's history (favourited and registered events) and a catalogue of upcoming events.
Identify 3 upcoming events that best match the student's demonstrated interests.
Do NOT recommend events already in the student's history.

Respond ONLY with valid JSON:
{
  "recommendations": [
    {
      "eventId": "string",
      "rank": 1,
      "justification": "string (max 80 words, in French, explaining the match)"
    }
  ]
}

Rules:
- Exactly 3 recommendations if possible, fewer if catalogue is small.
- rank 1 is the strongest match.
- No text outside the JSON object.
`;

export interface UserHistory {
  favorited: { title: string; category: string; tags: string[] }[];
  registered: { title: string; category: string; tags: string[] }[];
}

export function buildRecommendationMessage(
  history: UserHistory,
  upcomingEvents: EventSummary[]
): string {
  return `
Student history:
${JSON.stringify(history, null, 0)}

Upcoming events catalogue:
${JSON.stringify(upcomingEvents, null, 0)}
`;
}
