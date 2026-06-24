import { NoteType } from "@/types/types";
import { db } from "./db";

export const createNote = (title: string, description: string) => {
  return db.runSync(
    `
    INSERT INTO notes (
      title,
      description,
      createdAt
    )
    VALUES (?, ?, ?)
    `,
    [title, description, new Date().toISOString()],
  );
};

export const getNotes = (): NoteType[] => {
  return db.getAllSync(
    `SELECT * FROM notes
    ORDER BY createdAt DESC
  `,
  ) as NoteType[];
};

export const deleteNote = (id: number) => {
  return db.runSync(
    `
    DELETE FROM notes where id = ?
    `,
    [id],
  );
};

export const getNoteById = (id: number): NoteType => {
  return db.getFirstSync(
    `
    SELECT * FROM notes where id = ?
    `,
    [id],
  ) as NoteType;
};

export const updateNote = (id: number, title: string, description: string) => {
  return db.runSync(
    `
    UPDATE notes
    SET title = ? , description = ?
    WHERE id = ?
  `,
    [title, description, id],
  );
};
