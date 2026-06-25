import { Attendance } from "@/types/attendance";
import { db } from "./db";

export const markAttennace = (
  date: string,
  routineId: number,
  status: "present" | "absent",
) => {
  db.runSync(
    `
        INSERT OR REPLACE INTO attendance
        (date,routineId,status) 
        VALUES(?,?,?)
        `,
    [date, routineId, status],
  );
};

export const getAttendanceByDate = (date: string) => {
  return db.getAllSync<Attendance>(
    `
        SELECT * FROM attendance
        WHERE date = ?
        `,
    [date],
  );
};

export const getOverallAttendance = () => {
  const attendance = db.getAllSync<Attendance>(`SELECT * FROM attendance`);

  const conducted = attendance.filter(
    (a) => a.status === "present" || a.status === "absent",
  );

  const present = conducted.filter((a) => a.status === "present");

  return {
    present: present.length,
    conducted: conducted.length,
    percentage:
      conducted.length === 0
        ? 0
        : Math.round((present.length / conducted.length) * 100),
  };
};
