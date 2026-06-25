import { AttendanceCard } from "@/components/routine/AttendanceCard";
import { ClassesCard } from "@/components/routine/ClassesCard";
import { RoutineList } from "@/components/routine/RoutineList";
import { RoutineWeek } from "@/components/routine/RoutineWeek";
import { routine } from "@/data/routine";
import { getCurrentWeek } from "@/utils/generateCurrentWeek";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { getGreeting } from "@/utils/getGreeting";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Routine = () => {
  const userName = "Nawaz";

  const currentWeek = getCurrentWeek();

  const [selectedDate, setSelectedDate] = useState(
    currentWeek.find((d) => d.isToday)?.date ?? new Date(),
  );

  const day = selectedDate
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toLowerCase() as keyof typeof routine;

  const classes = routine[day] ?? [];

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View className="flex-1 bg-background px-4">
        {/* Header */}
        <View>
          <Text className="mt-4 text-white text-4xl font-bold tracking-tight">
            {getGreeting() + ","}
          </Text>

          <Text className="text-primary font-bold text-3xl">{userName}</Text>

          <View className="flex-row gap-x-2 mt-1">
            <Ionicons name="calendar-outline" color="white" size={16} />
            <Text className="text-muted font-bold">{getFormattedDate()}</Text>
          </View>

          <View className="flex-row mt-4 gap-x-2 justify-between">
            <ClassesCard selectedDate={selectedDate} />
            <AttendanceCard />
          </View>
        </View>

        {/* Week Selector */}
        <View className="mt-6">
          <RoutineWeek
            week={currentWeek}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </View>

        {/* Scrollable Class List */}
        <View className="flex-1">
          <RoutineList classes={classes} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Routine;
