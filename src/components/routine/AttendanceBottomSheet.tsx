import { routine } from "@/data/routine";
import { useAttendance } from "@/hooks/useAttendance";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  routineClass: (typeof routine)[keyof typeof routine][number] | null;
  attendance: ReturnType<typeof useAttendance>;
};

const AttendanceBottomSheet = forwardRef<BottomSheet, Props>(
  ({ routineClass, attendance }, ref) => {
    const snapPoints = useMemo(() => ["60%", "85%"], []);

    const currentStatus = routineClass
      ? attendance.getStatus(routineClass.id)
      : null;

    const handlePresentPress = () => {
      if (!routineClass) return;

      attendance.mark(routineClass.id, "present");
    };

    const handleAbsentPress = () => {
      if (!routineClass) return;

      attendance.mark(routineClass.id, "absent");
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: "#1C1C1E",
        }}
        handleIndicatorStyle={{
          backgroundColor: "#888",
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetView className="flex-1 px-6 py-6">
          <View>
            <Text className="text-2xl font-bold text-white">
              Mark Attendance
            </Text>

            <Text className="mt-1 text-base text-muted">
              Record today's attendance
            </Text>
          </View>

          <View className="mt-4 rounded-3xl bg-surface p-5">
            <View className="flex-row items-center">
              <View
                className="mr-3 h-4 w-4 rounded-full"
                style={{
                  backgroundColor: routineClass?.color,
                }}
              />

              <Text className="flex-1 text-xl font-bold text-white">
                {routineClass?.subject}
              </Text>
            </View>

            <View className="mt-5 gap-y-3">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#9CA3AF" />

                <Text className="ml-3 text-base text-white">
                  {routineClass?.start} – {routineClass?.end}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={18} color="#9CA3AF" />

                <Text className="ml-3 text-base text-white">
                  Room {routineClass?.room}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={18} color="#9CA3AF" />

                <Text className="ml-3 text-base text-white">
                  {routineClass?.teacher}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-4">
            {currentStatus === null ? (
              <>
                <Pressable
                  onPress={handlePresentPress}
                  className="mb-3 active:opacity-80"
                  android_ripple={{ color: "#22c55e20" }}
                >
                  <View className="flex-row items-center rounded-3xl border border-green-500/20 bg-surface px-4 py-4">
                    <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
                      <Ionicons
                        name="checkmark-circle"
                        size={26}
                        color="#22C55E"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-lg font-bold text-white">
                        Present
                      </Text>

                      <Text className="mt-1 text-muted">
                        Mark yourself present
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#6B7280"
                    />
                  </View>
                </Pressable>

                <Pressable
                  onPress={handleAbsentPress}
                  className="active:opacity-80"
                  android_ripple={{ color: "#ef444420" }}
                >
                  <View className="flex-row items-center rounded-3xl border border-red-500/20 bg-surface px-4 py-4">
                    <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-red-500/15">
                      <Ionicons name="close-circle" size={26} color="#EF4444" />
                    </View>

                    <View className="flex-1">
                      <Text className="text-lg font-bold text-white">
                        Absent
                      </Text>

                      <Text className="mt-1 text-muted">
                        Mark yourself absent
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#6B7280"
                    />
                  </View>
                </Pressable>
              </>
            ) : (
              <View
                className={`rounded-3xl border p-5 ${
                  currentStatus === "present"
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      currentStatus === "present"
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={34}
                    color={currentStatus === "present" ? "#22C55E" : "#EF4444"}
                  />

                  <View className="ml-4 flex-1">
                    <Text
                      className={`text-xl font-bold ${
                        currentStatus === "present"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {currentStatus === "present" ? "Present" : "Absent"}
                    </Text>

                    <Text className="mt-1 text-muted">
                      Attendance has already been marked.
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={
                    currentStatus === "present"
                      ? handleAbsentPress
                      : handlePresentPress
                  }
                  className="mt-5 rounded-2xl bg-surface py-4"
                >
                  <Text className="text-center font-semibold text-white">
                    Change to{" "}
                    {currentStatus === "present" ? "Absent" : "Present"}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

AttendanceBottomSheet.displayName = "AttendanceBottomSheet";

export default AttendanceBottomSheet;
