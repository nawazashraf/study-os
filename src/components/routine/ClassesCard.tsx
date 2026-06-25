import { routine } from "@/data/routine";
import { getAttendanceByDate } from "@/database/attendanceService";
import { Text, View } from "react-native";

export const ClassesCard = ({ selectedDate }: { selectedDate: Date }) => {
  const day = selectedDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof typeof routine;

  const classes = routine[day] ?? [];

  const selectedDateString = selectedDate.toISOString().split("T")[0];

  const attendance = getAttendanceByDate(selectedDateString);



  console.log(attendance);

  const merged = classes.map((item) => {
    const record = attendance.find((a) => a.routineId === item.id);

    return {
      ...item,
      attendance: record?.status ?? null,
    };
  });

  console.log(merged);

  const actualClasses = merged.filter((item) => item.subject !== "Recess");

  const attended = actualClasses.filter(
    (item) => item.attendance === "present",
  ).length;

  const attendancePercent = (attended / actualClasses.length) * 100;

  return (
    <View className="bg-surface w-[48%] flex justify-center h-24 rounded-3xl px-6 py-1">
      <Text className="text-muted font-lg font-bold tracking-tight text-xs">
        CLASSES
      </Text>
      <Text className="text-white text-2xl">
        {attended}/{actualClasses.length}
      </Text>
      <View
        className={`w-full h-1.5 bg-zinc-700 rounded-full mt-2 overflow-hidden`}
      >
        <View
          style={{
            width: attendancePercent,
          }}
          className={`h-full bg-green-600`}
        />
      </View>
    </View>
  );
};
