import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('campusevents.db');

export function initDatabase(): void {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS events (
      id              TEXT PRIMARY KEY,
      title           TEXT NOT NULL,
      description     TEXT NOT NULL,
      category        TEXT NOT NULL CHECK(category IN ('Talk','Workshop','Club','Exam','Other')),
      startDateTime   TEXT NOT NULL,
      endDateTime     TEXT,
      locationName    TEXT NOT NULL,
      locationAddress TEXT,
      organizerName   TEXT NOT NULL DEFAULT 'Campus Admin',
      capacity        INTEGER,
      registeredCount INTEGER NOT NULL DEFAULT 0,
      imageUrl        TEXT,
      tags            TEXT NOT NULL DEFAULT '[]',
      createdAt       TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS registrations (
      id         TEXT PRIMARY KEY,
      eventId    TEXT NOT NULL,
      userId     TEXT NOT NULL,
      createdAt  TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'confirmed'
                 CHECK(status IN ('confirmed','cancelled')),
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      UNIQUE(eventId, userId)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      eventId    TEXT NOT NULL,
      userId     TEXT NOT NULL,
      createdAt  TEXT NOT NULL,
      PRIMARY KEY (eventId, userId),
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS llm_results (
      id         TEXT PRIMARY KEY,
      eventId    TEXT,
      userId     TEXT NOT NULL,
      type       TEXT NOT NULL CHECK(type IN ('search','recommendation','planning','qa')),
      inputText  TEXT NOT NULL,
      outputText TEXT NOT NULL,
      createdAt  TEXT NOT NULL
    );
  `);
}
