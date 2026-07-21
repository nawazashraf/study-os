import AttendanceBottomSheet from "@/components/routine/AttendanceBottomSheet";
import { AttendanceCard } from "@/components/routine/AttendanceCard";
import { ClassesCard } from "@/components/routine/ClassesCard";
import { RoutineList } from "@/components/routine/RoutineList";
import { RoutineWeek } from "@/components/routine/RoutineWeek";
import { routine } from "@/data/routine";
import { useAttendance } from "@/hooks/useAttendance";
import { getWeekForDate } from "@/utils/generateCurrentWeek";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { getGreeting } from "@/utils/getGreeting";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Routine = () => {
  const userName = "Nawaz";
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [referenceDate, setReferenceDate] = useState(new Date());

  const currentWeek = getWeekForDate(referenceDate);

  const [selectedDate, setSelectedDate] = useState(
    currentWeek.find((d) => d.isToday)?.date ?? currentWeek[0].date,
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
            <View className="mt-3 flex-row items-center justify-center gap-4">
              <Pressable
                onPress={() => {
                  const newRef = new Date(referenceDate);
                  newRef.setDate(newRef.getDate() - 7);
                  setReferenceDate(newRef);
                  const wk = getWeekForDate(newRef);
                  setSelectedDate(wk[0].date);
                }}
                className="px-3 py-2 rounded-2xl bg-surface"
              >
                <Ionicons name="chevron-back" size={18} color="#fff" />
              </Pressable>

              <Text className="text-sm text-zinc-400">
                Week of {currentWeek[0].date.toLocaleDateString()}
              </Text>

              <Pressable
                onPress={() => {
                  const newRef = new Date(referenceDate);
                  newRef.setDate(newRef.getDate() + 7);
                  setReferenceDate(newRef);
                  const wk = getWeekForDate(newRef);
                  setSelectedDate(wk[0].date);
                }}
                className="px-3 py-2 rounded-2xl bg-surface"
              >
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>

          {/* Routine */}

          <View className="flex-1">
            <RoutineList
              classes={classes}
              onClassPress={(item) => {
                setSelectedClass(item);
                // Do not open attendance sheet for recess entries
                if (
                  (item.subject ?? "").toString().trim().toLowerCase() ===
                  "recess"
                ) {
                  return;
                }

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
