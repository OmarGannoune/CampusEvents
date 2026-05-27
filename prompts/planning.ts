import type { EventSummary, StudentProfile } from '@/types';

export const SYSTEM_PROMPT = `
You are a university scheduling assistant.
You receive a student's time constraints in natural language and a list of events happening this week.
Your task is to suggest a conflict-free participation schedule.

Respond ONLY with valid JSON:
{
  "planning": [
    {
      "eventId": "string",
      "dayLabel": "string (e.g. 'LUN', 'MAR')",
      "startTime": "string (e.g. '14:00')",
      "status": "suggested" | "conflict",
      "note": "string (optional, max 60 words, in French)"
    }
  ],
  "summary": "string (2-3 sentence French summary of the suggested week)"
}

Rules:
- Flag genuine conflicts (event during stated blocked time) with status "conflict".
- Do not include past events.
- No text outside the JSON object.
`;

function formatProfile(profile?: StudentProfile | null): string | null {
  if (!profile) {
    return null;
  }
  const parts: string[] = [];
  if (profile.filiere.trim()) {
    parts.push(`Filiere: ${profile.filiere.trim()}`);
  }
  if (profile.annee.trim()) {
    parts.push(`Annee: ${profile.annee.trim()}`);
  }
  if (profile.interests.length > 0) {
    parts.push(`Interests: ${profile.interests.join(', ')}`);
  }
  if (parts.length === 0) {
    return null;
  }
  return `Student profile: ${parts.join(', ')}`;
}

export function buildPlanningMessage(
  constraints: string,
  weekEvents: EventSummary[],
  profile?: StudentProfile | null
): string {
  const profileBlock = formatProfile(profile);
  return `
${profileBlock ? `${profileBlock}\n\n` : ''}
Student constraints: "${constraints}"

Events this week:
${JSON.stringify(weekEvents, null, 0)}
`;
}
