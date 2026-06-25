import {
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
    getStatus,
  };
};
