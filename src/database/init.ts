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

  const existingTable = db.getAllSync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='assignments'",
  );

  if (!existingTable.length) {
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
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return;
  }

  const existingColumns = new Set(
    db
      .getAllSync<{ name: string }>("PRAGMA table_info(assignments)")
      .map((column) => column.name),
  );

  const insertColumns = [
    "id",
    "title",
    "subjectId",
    "dueDate",
    "priority",
    "attachmentUri",
    "attachmentName",
    "attachmentMimeType",
    "completed",
    "createdAt",
  ];
  const selectExpressions = insertColumns.map((column) =>
    existingColumns.has(column) ? column : "NULL",
  );

  db.execSync(`
    CREATE TABLE assignments_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subjectId INTEGER,
      dueDate TEXT,
      priority TEXT DEFAULT 'medium',
      attachmentUri TEXT,
      attachmentName TEXT,
      attachmentMimeType TEXT,
      completed INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO assignments_new (${insertColumns.join(", ")})
    SELECT ${selectExpressions.join(", ")} FROM assignments;

    DROP TABLE assignments;
    ALTER TABLE assignments_new RENAME TO assignments;
  `);
};
