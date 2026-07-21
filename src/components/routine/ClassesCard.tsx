import { routine } from "@/data/routine";
import { useAttendance } from "@/hooks/useAttendance";
import { getRoutineClassUnits } from "@/utils/getRoutineClassUnits";
import { Text, View } from "react-native";

type Props = {
  selectedDate: Date;
  attendance: ReturnType<typeof useAttendance>;
};

export const ClassesCard = ({ selectedDate, attendance }: Props) => {
  const day = selectedDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof typeof routine;

  const classes = routine[day] ?? [];

  const actualClasses = classes.filter((item) => item.subject !== "Recess");

  const attendedUnits = actualClasses.reduce((sum, item) => {
    if (attendance.getStatus(item.id) === "present") {
      return sum + getRoutineClassUnits(item);
    }
    return sum;
  }, 0);

  const totalUnits = actualClasses.reduce(
    (sum, item) => sum + getRoutineClassUnits(item),
    0,
  );

  const attendancePercent =
    totalUnits === 0 ? 0 : (attendedUnits / totalUnits) * 100;

  return (
    <View className="bg-surface w-[48%] h-24 rounded-3xl px-6 py-1 justify-center">
      <Text className="text-xs font-bold tracking-tight text-muted">
        CLASSES
      </Text>

      <Text className="text-2xl text-white">
        {attendedUnits}/{totalUnits}
      </Text>

      <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-700">
        <View
          className="h-full bg-green-600"
          style={{
            width: `${attendancePercent}%`,
          }}
        />
      </View>
    </View>
  );
};
