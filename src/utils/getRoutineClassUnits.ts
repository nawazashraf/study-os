import { routine, RoutineClass } from "@/data/routine";

const allRoutineClasses = Object.values(routine).flat();
const routineClassById = new Map<number, RoutineClass>(
  allRoutineClasses.map((item) => [item.id, item]),
);

const parseTime = (time: string): number => {
  const [rawHour, rawMinute] = time.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute ?? "0");
  return hour * 60 + minute;
};

export const getRoutineClassUnits = (routineClass: RoutineClass) => {
  const startMinutes = parseTime(routineClass.start);
  const endMinutes = parseTime(routineClass.end);
  const durationMinutes =
    endMinutes >= startMinutes
      ? endMinutes - startMinutes
      : endMinutes + 12 * 60 - startMinutes;

  const units = durationMinutes / 60;
  return Math.max(1, Math.round(units));
};

export const getRoutineClassUnitsById = (routineId: number) => {
  const routineClass = routineClassById.get(routineId);
  if (!routineClass) {
    return 1;
  }
  return getRoutineClassUnits(routineClass);
};
