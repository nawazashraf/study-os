import { getCurrentWeek } from "@/utils/generateCurrentWeek";

export type RoutineWeekProps = {
  week: ReturnType<typeof getCurrentWeek>;
  selectedDate: Date;
  onSelect: (date: Date) => void;
};
