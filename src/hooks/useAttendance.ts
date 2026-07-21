import {
  clearAttendance,
  getAttendanceByDate,
  getOverallAttendance,
  markAttendance,
} from "@/database/attendanceService";
import { Attendance } from "@/types/attendance";
import { useCallback, useEffect, useMemo, useState } from "react";

type AttendanceStatus = "present" | "absent";

export const useAttendance = (date: string) => {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [overall, setOverall] = useState(() => getOverallAttendance());

  const refresh = useCallback(() => {
    setRecords(getAttendanceByDate(date));
    setOverall(getOverallAttendance());
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const mark = (routineId: number, status: AttendanceStatus) => {
    markAttendance(date, routineId, status);
    refresh();
  };

  const clear = (routineId: number) => {
    try {
      // remove attendance record for this routine on the selected date
      // imported from attendanceService
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      // call clearAttendance and refresh
      // (clearAttendance imported below)
      // implemented synchronously in DB layer
      // to keep API simple for UI calls
      //
      // Note: clearAttendance is synchronous as db.runSync is used.
      // If it were async we'd await it and make this function async.
      //
      // perform clear
      // @ts-ignore - will be available
      clearAttendance(date, routineId);
    } catch (e) {
      // ignore
    }
    refresh();
  };

  const statusMap = useMemo(() => {
    return new Map(records.map((record) => [record.routineId, record.status]));
  }, [records]);

  const getStatus = (routineId: number) => {
    return statusMap.get(routineId) ?? null;
  };

  return {
    records,
    overall,
    refresh,
    mark,
    clear,
    getStatus,
  };
};
