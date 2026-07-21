import { Attendance } from "@/types/attendance";
import { db } from "./db";
import { getRoutineClassUnitsById } from "@/utils/getRoutineClassUnits";

export const markAttendance = (
  date: string,
  routineId: number,
  status: "present" | "absent",
) => {
  db.runSync(
    `
    INSERT OR REPLACE INTO attendance
    (date, routineId, status)
    VALUES (?, ?, ?)
    `,
    [date, routineId, status],
  );
};

export const getAttendance = (date: string, routineId: number) => {
  return db.getFirstSync<Attendance>(
    `
    SELECT *
    FROM attendance
    WHERE date = ?
      AND routineId = ?
    `,
    [date, routineId],
  );
};

export const getAttendanceByDate = (date: string) => {
  return db.getAllSync<Attendance>(
    `
    SELECT *
    FROM attendance
    WHERE date = ?
    `,
    [date],
  );
};

export const getOverallAttendance = () => {
  const attendance = db.getAllSync<Attendance>(`SELECT * FROM attendance`);

  const conducted = attendance.reduce(
    (sum, item) => sum + getRoutineClassUnitsById(item.routineId),
    0,
  );

  const present = attendance
    .filter((a) => a.status === "present")
    .reduce((sum, item) => sum + getRoutineClassUnitsById(item.routineId), 0);

  return {
    present,
    conducted,
    percentage: conducted === 0 ? 0 : Math.round((present / conducted) * 100),
  };
};

export const clearAttendance = (date: string, routineId: number) => {
  db.runSync(
    `
    DELETE FROM attendance
    WHERE date = ?
      AND routineId = ?
    `,
    [date, routineId],
  );
};
