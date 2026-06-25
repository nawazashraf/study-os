import { Attendance } from "@/types/attendance";
import { db } from "./db";

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

  const conducted = attendance.length;

  const present = attendance.filter((a) => a.status === "present").length;

  return {
    present,
    conducted,
    percentage: conducted === 0 ? 0 : Math.round((present / conducted) * 100),
  };
};
