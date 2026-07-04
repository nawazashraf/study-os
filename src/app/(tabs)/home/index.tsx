import ActivityCard from "@/components/home/ActivityCard";
import EmptyState from "@/components/home/EmptyState";
import Header from "@/components/home/Header";
import HeroCard from "@/components/home/HeroCard";
import QuickActions from "@/components/home/QuickActions";
import SectionHeader from "@/components/home/SectionHeader";
import { activityService } from "@/database/activityService";
import type { Activity } from "@/types/activity";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { getGreeting } from "@/utils/getGreeting";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [studyDuration, setStudyDuration] = useState(0);
  const [streak, setStreak] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const bottomOffset = 88;

  const loadData = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0];

    const todayActivities = await activityService.getTodayActivities();
    const totalDuration = await activityService.getTotalDurationByDate(today);
    const currentStreak = await activityService.getCurrentStreak();

    setActivities(todayActivities);
    setStudyDuration(totalDuration);
    setStreak(currentStreak);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const onRefresh = () => {
    setRefreshing(true);

    loadData();

    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <Header />

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <>
            {/* Greeting */}

            <View className="mb-6">
              <Text className="text-3xl font-bold text-text">
                {getGreeting()}
              </Text>

              <View className="mt-2 flex-row items-center justify-between">
                <Text className="text-text-secondary">
                  Let's make today productive.
                </Text>

                <Text className="rounded-2xl bg-surface px-4 py-2 text-text-secondary">
                  {getFormattedDate()}
                </Text>
              </View>
            </View>

            <HeroCard
              studyDuration={studyDuration}
              activitiesCount={activities.length}
              streak={streak}
            />

            <QuickActions />

            <SectionHeader
              title="Today's Activities"
              subtitle="Your learning sessions"
              actionText="View All"
              onPressAction={() => router.push("/activity")}
            />
          </>
        }
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onPress={() => {
              // router.push(`/activity/${item.id}`);
            }}
            onMorePress={() => {
              // Open Bottom Sheet
            }}
          />
        )}
        ListEmptyComponent={
          <View className="mt-6">
            <EmptyState />
          </View>
        }
      />

      {/* Action Button */}

      <Pressable
        onPress={() => router.push("/activity/create")}
        className="absolute z-50 bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
        android_ripple={{
          color: "#ffffff20",
          borderless: true,
        }}
        style={{
          bottom: bottomOffset,
        }}
      >
        <Text className="text-4xl font-light text-white">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
