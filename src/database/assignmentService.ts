import {
  Assignment,
  AssignmentRow,
  CreateAssignment,
} from "@/types/assignment";
import { db } from "./db";
import { initDB } from "./init";

initDB();

export const createAssignment = (data: CreateAssignment) => {
  initDB();
  const result = db.runSync(
    `
        INSERT INTO assignments (
          title,
          subjectId,
          dueDate,
          priority,
          attachmentUri,
          attachmentName,
          attachmentMimeType,
          completed
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,

    [
      data.title,
      data.subjectId,
      data.dueDate ?? null,
      data.priority || "medium",
      data.attachmentUri ?? null,
      data.attachmentName ?? null,
      data.attachmentMimeType ?? null,
      (data.completed ?? false) ? 1 : 0,
    ],
  );

  console.log("Inserted:", result.lastInsertRowId);

  return result.lastInsertRowId;
};

export const getAllAssignments = async (): Promise<Assignment[]> => {
  const assignments = await db.getAllAsync<AssignmentRow>(
    `SELECT * FROM assignments`,
  );

  console.log(assignments);

  return assignments.map((assignment) => ({
    ...assignment,
    completed: assignment.completed === 1,
  }));
};

export const getAssignmentById = (id: number): Assignment | null => {
  const assignment = db.getFirstSync<AssignmentRow>(
    `SELECT * FROM assignments WHERE id = ?`,
    [id],
  );

  if (!assignment) return null;

  return {
    ...assignment,
    completed: assignment.completed === 1,
  };
};
export const updateAssignment = () => {};

export const deleteAssignment = (id: number) => {
  return db.runSync(
    `
    DELETE FROM assignments
    WHERE id = ?
    `,
    [id],
  );
};

export const updateAssignmentCompletion = async (
  completed: boolean,
  id: number,
) => {
  return await db.runAsync(
    `
    UPDATE assignments
    SET completed = ?
    WHERE id = ?
    `,
    [completed ? 1 : 0, id],
  );
};
