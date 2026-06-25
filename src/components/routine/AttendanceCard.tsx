import { useAttendance } from "@/hooks/useAttendance";
import { getAttendanceInfo } from "@/utils/getAttendanceInfo";
import { Text, View } from "react-native";

type Props = {
  attendance: ReturnType<typeof useAttendance>;
};

export const AttendanceCard = ({ attendance }: Props) => {
  const stats = attendance.overall;

  const info = getAttendanceInfo(stats.percentage);

  return (
    <View className="bg-surface w-[48%] h-24 rounded-3xl px-6 py-1 justify-center">
      <Text className="text-xs font-bold tracking-tight text-muted">
        ATTENDANCE
      </Text>

      <Text
        className="text-2xl font-bold"
        style={{
          color: info.color,
        }}
      >
        {stats.percentage}%
      </Text>

      <Text
        className="text-xs font-bold"
        style={{
          color: info.color,
        }}
      >
        {info.title}
      </Text>
    </View>
  );
};
