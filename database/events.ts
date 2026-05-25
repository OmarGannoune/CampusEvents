import type { Event, EventCategory } from '@/types';

import { generateId } from '@/utils/ids';
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

function mapEventRows(rows: EventRow[]): Event[] {
  return rows.map(mapEvent);
}

export function getAllEvents(): Event[] {
  const rows = db.getAllSync<EventRow>('SELECT * FROM events ORDER BY startDateTime DESC');
  return mapEventRows(rows);
}

export function getEventById(id: string): Event | null {
  const row = db.getFirstSync<EventRow>('SELECT * FROM events WHERE id = ?', id);
  return row ? mapEvent(row) : null;
}

export function getUpcomingEvents(): Event[] {
  const now = new Date().toISOString();
  const rows = db.getAllSync<EventRow>(
    'SELECT * FROM events WHERE startDateTime >= ? ORDER BY startDateTime ASC',
    now
  );
  return mapEventRows(rows);
}

export function getPastEvents(): Event[] {
  const now = new Date().toISOString();
  const rows = db.getAllSync<EventRow>(
    'SELECT * FROM events WHERE startDateTime < ? ORDER BY startDateTime DESC',
    now
  );
  return mapEventRows(rows);
}

export function createEvent(
  data: Omit<Event, 'id' | 'createdAt' | 'registeredCount'>
): Event {
  const id = generateId();
  const createdAt = new Date().toISOString();
  db.runSync(
    `INSERT INTO events (
      id, title, description, category, startDateTime, endDateTime, locationName,
      locationAddress, organizerName, capacity, registeredCount, imageUrl, tags, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ,
    id,
    data.title,
    data.description,
    data.category,
    data.startDateTime,
    data.endDateTime ?? null,
    data.locationName,
    data.locationAddress ?? null,
    data.organizerName ?? 'Campus Admin',
    data.capacity ?? null,
    0,
    data.imageUrl ?? null,
    JSON.stringify(data.tags ?? []),
    createdAt
  );
  return {
    ...data,
    id,
    createdAt,
    registeredCount: 0,
    tags: data.tags ?? [],
  };
}

export function updateEvent(id: string, data: Partial<Event>): Event {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];

  const pushField = (field: keyof Event, value: string | number | null) => {
    fields.push(`${field} = ?`);
    values.push(value);
  };

  if (data.title !== undefined) pushField('title', data.title);
  if (data.description !== undefined) pushField('description', data.description);
  if (data.category !== undefined) pushField('category', data.category);
  if (data.startDateTime !== undefined) pushField('startDateTime', data.startDateTime);
  if (data.endDateTime !== undefined) pushField('endDateTime', data.endDateTime ?? null);
  if (data.locationName !== undefined) pushField('locationName', data.locationName);
  if (data.locationAddress !== undefined) pushField('locationAddress', data.locationAddress ?? null);
  if (data.organizerName !== undefined) pushField('organizerName', data.organizerName);
  if (data.capacity !== undefined) pushField('capacity', data.capacity ?? null);
  if (data.registeredCount !== undefined) pushField('registeredCount', data.registeredCount);
  if (data.imageUrl !== undefined) pushField('imageUrl', data.imageUrl ?? null);
  if (data.tags !== undefined) pushField('tags', JSON.stringify(data.tags));

  if (fields.length > 0) {
    db.runSync(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, ...values, id);
  }

  const updated = getEventById(id);
  if (!updated) {
    throw new Error('Event not found');
  }
  return updated;
}

export function deleteEvent(id: string): void {
  db.runSync('DELETE FROM events WHERE id = ?', id);
}

export function searchEvents(query: string): Event[] {
  const term = `%${query.toLowerCase()}%`;
  const rows = db.getAllSync<EventRow>(
    'SELECT * FROM events WHERE LOWER(title) LIKE ? ORDER BY startDateTime ASC',
    term
  );
  return mapEventRows(rows);
}

export function filterByCategory(category: EventCategory): Event[] {
  const rows = db.getAllSync<EventRow>(
    'SELECT * FROM events WHERE category = ? ORDER BY startDateTime ASC',
    category
  );
  return mapEventRows(rows);
}

export function getEventsThisWeek(): Event[] {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(now.getDate() - diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  const rows = db.getAllSync<EventRow>(
    'SELECT * FROM events WHERE startDateTime >= ? AND startDateTime < ? ORDER BY startDateTime ASC',
    start.toISOString(),
    end.toISOString()
  );
  return mapEventRows(rows);
}
