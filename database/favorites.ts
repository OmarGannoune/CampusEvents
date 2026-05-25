import type { Event } from '@/types';

import { db } from './init';

type EventRow = Omit<Event, 'tags' | 'endDateTime' | 'capacity'> & {
  tags: string;
  endDateTime: string | null;
  capacity: number | null;
};

function parseTags(value: string | null): string[] {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapEvent(row: EventRow): Event {
  return {
    ...row,
    tags: parseTags(row.tags),
    endDateTime: row.endDateTime ?? undefined,
    capacity: row.capacity ?? undefined,
  };
}

export function getFavoritesForUser(userId: string): string[] {
  const rows = db.getAllSync<{ eventId: string }>(
    'SELECT eventId FROM favorites WHERE userId = ? ORDER BY createdAt DESC',
    userId
  );
  return rows.map((row) => row.eventId);
}

export function isFavorited(eventId: string, userId: string): boolean {
  const row = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM favorites WHERE eventId = ? AND userId = ?',
    eventId,
    userId
  );
  return (row?.count ?? 0) > 0;
}

export function addFavorite(eventId: string, userId: string): void {
  db.runSync(
    'INSERT OR IGNORE INTO favorites (eventId, userId, createdAt) VALUES (?, ?, ?)',
    eventId,
    userId,
    new Date().toISOString()
  );
}

export function removeFavorite(eventId: string, userId: string): void {
  db.runSync('DELETE FROM favorites WHERE eventId = ? AND userId = ?', eventId, userId);
}

export function getFavoriteEvents(userId: string): Event[] {
  const rows = db.getAllSync<EventRow>(
    `SELECT events.*
     FROM favorites
     INNER JOIN events ON events.id = favorites.eventId
     WHERE favorites.userId = ?
     ORDER BY events.startDateTime ASC`,
    userId
  );
  return rows.map(mapEvent);
}
