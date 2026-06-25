import { routine } from "@/data/routine";
import { useAttendance } from "@/hooks/useAttendance";
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

  //removing recess
  const actualClasses = classes.filter((item) => item.subject !== "Recess");

  const attended = actualClasses.filter(
    (item) => attendance.getStatus(item.id) === "present",
  ).length;

  const attendancePercent =
    actualClasses.length === 0 ? 0 : (attended / actualClasses.length) * 100;

  return (
    <View className="bg-surface w-[48%] h-24 rounded-3xl px-6 py-1 justify-center">
      <Text className="text-xs font-bold tracking-tight text-muted">
        CLASSES
      </Text>

      <Text className="text-2xl text-white">
        {attended}/{actualClasses.length}
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
