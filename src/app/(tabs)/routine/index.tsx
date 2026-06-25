import AttendanceBottomSheet from "@/components/routine/AttendanceBottomSheet";
import { AttendanceCard } from "@/components/routine/AttendanceCard";
import { ClassesCard } from "@/components/routine/ClassesCard";
import { RoutineList } from "@/components/routine/RoutineList";
import { RoutineWeek } from "@/components/routine/RoutineWeek";
import { routine } from "@/data/routine";
import { useAttendance } from "@/hooks/useAttendance";
import { getCurrentWeek } from "@/utils/generateCurrentWeek";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { getGreeting } from "@/utils/getGreeting";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Routine = () => {
    
  const userName = "Nawaz";
  const bottomSheetRef = useRef<BottomSheet>(null);

  const currentWeek = getCurrentWeek();

  const [selectedDate, setSelectedDate] = useState(
    currentWeek.find((d) => d.isToday)?.date ?? new Date(),
  );

  const day = selectedDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof typeof routine;

  const classes = routine[day] ?? [];

  const [selectedClass, setSelectedClass] = useState<
    (typeof classes)[number] | null
  >(null);

  const attendanceDate = selectedDate.toISOString().split("T")[0];

  const attendance = useAttendance(attendanceDate);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <View className="flex-1 bg-background px-4">
          {/* Header */}

          <View>
            <Text className="mt-4 text-4xl font-bold tracking-tight text-white">
              {getGreeting()},
            </Text>

            <Text className="text-3xl font-bold text-primary">{userName}</Text>

            <View className="mt-1 flex-row gap-x-2">
              <Ionicons name="calendar-outline" color="white" size={16} />

              <Text className="font-bold text-muted">{getFormattedDate()}</Text>
            </View>

            <View className="mt-4 flex-row justify-between gap-x-2">
              <ClassesCard
                selectedDate={selectedDate}
                attendance={attendance}
              />

              <AttendanceCard attendance={attendance} />
            </View>
          </View>

          {/* Week */}

          <View className="mt-6">
            <RoutineWeek
              week={currentWeek}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
          </View>

          {/* Routine */}

          <View className="flex-1">
            <RoutineList
              classes={classes}
              onClassPress={(item) => {
                setSelectedClass(item);
                bottomSheetRef.current?.snapToIndex(0);
              }}
            />
          </View>
        </View>
      </SafeAreaView>

      <AttendanceBottomSheet
        ref={bottomSheetRef}
        routineClass={selectedClass}
        attendance={attendance}
      />
    </View>
  );
};

export default Routine;
