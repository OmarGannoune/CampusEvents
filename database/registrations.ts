import type { Registration } from '@/types';

import { generateId } from '@/utils/ids';
import { db } from './init';

type RegistrationRow = Registration;

export function getRegistrationsForUser(userId: string): Registration[] {
  return db.getAllSync<RegistrationRow>(
    'SELECT * FROM registrations WHERE userId = ? ORDER BY createdAt DESC',
    userId
  );
}

export function getRegisteredEventIds(userId: string): string[] {
  const rows = db.getAllSync<{ eventId: string }>(
    'SELECT eventId FROM registrations WHERE userId = ? AND status = ? ORDER BY createdAt DESC',
    userId,
    'confirmed'
  );
  return rows.map((row) => row.eventId);
}

export function isRegistered(eventId: string, userId: string): boolean {
  const row = db.getFirstSync<{ count: number }>(
    'SELECT COUNT(*) as count FROM registrations WHERE eventId = ? AND userId = ? AND status = ?',
    eventId,
    userId,
    'confirmed'
  );
  return (row?.count ?? 0) > 0;
}

export function register(eventId: string, userId: string): Registration {
  const existing = db.getFirstSync<RegistrationRow>(
    'SELECT * FROM registrations WHERE eventId = ? AND userId = ?',
    eventId,
    userId
  );
  if (existing) {
    if (existing.status === 'confirmed') {
      return existing;
    }
    db.runSync(
      'UPDATE registrations SET status = ?, createdAt = ? WHERE id = ?',
      'confirmed',
      new Date().toISOString(),
      existing.id
    );
    db.runSync(
      'UPDATE events SET registeredCount = registeredCount + 1 WHERE id = ?',
      eventId
    );
    return { ...existing, status: 'confirmed' };
  }

  const registration: Registration = {
    id: generateId(),
    eventId,
    userId,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  };
  db.runSync(
    'INSERT INTO registrations (id, eventId, userId, createdAt, status) VALUES (?, ?, ?, ?, ?)',
    registration.id,
    registration.eventId,
    registration.userId,
    registration.createdAt,
    registration.status
  );
  db.runSync('UPDATE events SET registeredCount = registeredCount + 1 WHERE id = ?', eventId);
  return registration;
}

export function cancelRegistration(eventId: string, userId: string): void {
  db.runSync(
    'UPDATE registrations SET status = ? WHERE eventId = ? AND userId = ?',
    'cancelled',
    eventId,
    userId
  );
  db.runSync(
    `UPDATE events
     SET registeredCount = CASE WHEN registeredCount > 0 THEN registeredCount - 1 ELSE 0 END
     WHERE id = ?`,
    eventId
  );
}
