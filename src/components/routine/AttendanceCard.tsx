import { getOverallAttendance } from "@/database/attendanceService";
import { getAttendanceInfo } from "@/utils/getAttendanceInfo";
import { Text, View } from "react-native";

export const AttendanceCard = () => {
  const stats = getOverallAttendance();

  const info = getAttendanceInfo(stats.percentage);
  console.log("Stats" + stats.percentage + info.message + info.title);

  return (
    <View className="bg-surface w-[48%] flex justify-center h-24 rounded-3xl px-6 py-1">
      <Text className="text-muted font-lg font-bold tracking-tight text-xs">
        ATTENDANCE
      </Text>
      <Text
        style={{
          color: info.color,
        }}
        className={` text-2xl font-bold`}
      >
        {stats.percentage} %
      </Text>
      <Text
        style={{
          color: info.color,
        }}
        className="text-xs font-bold"
      >
        {info.title}
      </Text>
    </View>
  );
};
