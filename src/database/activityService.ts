import {
  Activity,
  CreateActivityDto,
  UpdateActivityDto,
} from "@/types/activity";
import { db } from "./db";

export const activityService = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getTodayActivities,
  getActivitiesByDate,
  getTotalDurationByDate,
  getCurrentStreak,
};

async function createActivity(data: CreateActivityDto) {
  const now = new Date().toISOString();

  const result = await db.runAsync(
    `INSERT INTO activities
      (category, title, duration, notes, activityDate, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.category,
      data.title,
      data.duration,
      data.notes ?? null,
      data.activityDate,
      now,
      now,
    ],
  );

  return getActivityById(result.lastInsertRowId as number);
}

async function getActivities() {
  return db.getAllAsync<Activity>(
    `SELECT *
     FROM activities
     ORDER BY activityDate DESC, createdAt DESC`,
  );
}

async function getActivityById(id: number) {
  return (
    (await db.getFirstAsync<Activity>(
      `SELECT *
       FROM activities
       WHERE id = ?`,
      [id],
    )) ?? null
  );
}

async function updateActivity(id: number, data: UpdateActivityDto) {
  const existing = await getActivityById(id);

  if (!existing) return false;

  await db.runAsync(
    `UPDATE activities
     SET
        category = ?,
        title = ?,
        duration = ?,
        notes = ?,
        activityDate = ?,
        updatedAt = ?
     WHERE id = ?`,
    [
      data.category ?? existing.category,
      data.title ?? existing.title,
      data.duration ?? existing.duration,
      data.notes ?? existing.notes,
      data.activityDate ?? existing.activityDate,
      new Date().toISOString(),
      id,
    ],
  );

  return true;
}

async function deleteActivity(id: number) {
  const result = await db.runAsync(
    `DELETE FROM activities
     WHERE id = ?`,
    [id],
  );

  return result.changes > 0;
}

async function getTodayActivities() {
  const today = new Date().toISOString().split("T")[0];

  return getActivitiesByDate(today);
}

async function getActivitiesByDate(date: string) {
  return db.getAllAsync<Activity>(
    `SELECT *
     FROM activities
     WHERE activityDate = ?
     ORDER BY createdAt DESC`,
    [date],
  );
}

async function getTotalDurationByDate(date: string) {
  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(duration), 0) AS total
     FROM activities
     WHERE activityDate = ?`,
    [date],
  );

  return result?.total ?? 0;
}

function getCurrentStreak() {
  const rows = db.getAllSync<{ activityDate: string }>(
    `
    SELECT DISTINCT activityDate
    FROM activities
    ORDER BY activityDate DESC
    `,
  );

  if (rows.length === 0) return 0;

  const dates = new Set(rows.map((row) => row.activityDate));

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateString = currentDate.toISOString().split("T")[0];

    if (!dates.has(dateString)) {
      break;
    }

    streak++;

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}
