export type Attendance = {
  id: number;
  date: string;
  routineId: number;
  status: "present" | "absent";
  createdAt: string;
};
