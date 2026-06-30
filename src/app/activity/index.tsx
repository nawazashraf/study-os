import { activityService } from "@/database/activityService";
import type { Activity } from "@/types/activity";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ActivityIndex() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);

  const loadActivities = useCallback(async () => {
    const activitiesResult = await activityService.getActivities();
    setActivities(activitiesResult as Activity[]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadActivities();
    }, [loadActivities]),
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-text">Activity History</Text>
          <Text className="mt-1 text-text-secondary">
            Review your recent study sessions.
          </Text>
        </View>

        <View>
          <Text className="mb-4 text-lg font-semibold text-text">
            Recent Entries
          </Text>

          {activities.length === 0 ? (
            <View className="rounded-2xl border border-white/10 bg-card p-4">
              <Text className="text-text-secondary">
                No activity entries yet.
              </Text>
            </View>
          ) : (
            activities.map((item) => (
              <View
                key={item.id}
                className="mb-3 rounded-2xl border border-white/10 bg-card p-4"
              >
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="font-semibold text-text">{item.title}</Text>
                  <Text className="text-sm text-primary">
                    {item.duration} min
                  </Text>
                </View>

                <Text className="text-sm text-text-secondary">
                  {item.category}
                </Text>

                <Text className="mt-2 text-sm text-muted">
                  {formatDate(item.activityDate)}
                </Text>

                {item.notes ? (
                  <Text className="mt-2 text-sm text-text-secondary">
                    {item.notes}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push("/activity/create")}
        className="h-14 w-14 items-center justify-center rounded-full bg-primary active:opacity-80"
        style={{
          position: "absolute",
          bottom: 72,
          right: 32,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
          zIndex: 55,
        }}
      >
        <Ionicons name="add" size={28} color="#000" />
      </Pressable>
    </SafeAreaView>
  );
}
