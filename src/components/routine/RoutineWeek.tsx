import { RoutineWeekProps } from "@/types/routine/routine-week";
import { Pressable, Text, View } from "react-native";

export const RoutineWeek = ({
  week,
  selectedDate,
  onSelect,
}: RoutineWeekProps) => {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between">
        {week.map((item) => {
          const isSelected =
            item.date.toDateString() === selectedDate.toDateString();

          return (
            <Pressable
              key={item.date.toISOString()}
              onPress={() => onSelect(item.date)}
              className={`min-w-14 px-3 py-4 rounded-3xl ${
                isSelected
                  ? "bg-primary shadow-2xl shadow-primary scale-110"
                  : "bg-surface"
              }`}
            >
              <Text className="text-white text-center">{item.dayName}</Text>

              <Text className="text-white text-center font-bold">
                {item.dayNumber}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
