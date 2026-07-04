import { db } from "./db";

const dropTables = () => {
  db.execSync(`
    DROP TABLE IF EXISTS notes;
    DROP TABLE IF EXISTS attendance;
    DROP TABLE IF EXISTS topic_progress;
    DROP TABLE IF EXISTS activities;
    DROP TABLE IF EXISTS assignments;
  `);
};

const createNotesTable = () => {
  db.execSync(`
    CREATE TABLE notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
};

const createAttendanceTable = () => {
  db.execSync(`
    CREATE TABLE attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      routineId INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('present', 'absent')),
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, routineId)
    );
  `);
};

const createTopicProgressTable = () => {
  db.execSync(`
    CREATE TABLE topic_progress (
      topic_id TEXT PRIMARY KEY,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at INTEGER
    );
  `);
};

const createActivitiesTable = () => {
  db.execSync(`
    CREATE TABLE activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      duration INTEGER NOT NULL,
      notes TEXT,
      activityDate TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
};

const createAssignmentsTable = () => {
  db.execSync(`
    CREATE TABLE assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subjectId INTEGER,
      dueDate TEXT,
      priority TEXT DEFAULT 'medium',
      attachmentUri TEXT,
      attachmentName TEXT,
      attachmentMimeType TEXT,
      completed INTEGER DEFAULT 0,
      completedAt TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const initDB = () => {
  db.execSync("PRAGMA journal_mode = WAL;");

  // dropTables();

  createNotesTable();
  createAttendanceTable();
  createTopicProgressTable();
  createActivitiesTable();
  createAssignmentsTable();
};
