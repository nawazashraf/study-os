import { db } from "./db";

export const initDB = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      routineId INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('present', 'absent')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, routineId)
    );
  `);
};
