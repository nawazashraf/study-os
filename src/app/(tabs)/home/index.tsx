// import QuoteCard from "@/components/home/QuoteCard";
// import { activityService } from "@/database/activityService";
// import type { Activity } from "@/types/activity";
// import { getFormattedDate } from "@/utils/getFormattedDate";
// import { getGreeting } from "@/utils/getGreeting";
// import { Ionicons } from "@expo/vector-icons";
// import { useFocusEffect, useRouter } from "expo-router";
// import { useCallback, useEffect, useState } from "react";
// import { Pressable, ScrollView, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
//   DSA: "construct-outline",
//   Development: "code-slash-outline",
//   "Core Subject": "book-outline",
//   Skill: "sparkles-outline",
// };

// const formatDuration = (totalMinutes: number) => {
//   if (totalMinutes < 60) return `${totalMinutes}m`;

//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;

//   return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
// };

// export default function Index() {
//   const router = useRouter();
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [studyDuration, setStudyDuration] = useState(0);
//   const [streak, setStreak] = useState(0);

//   const loadActivities = useCallback(async () => {
//     const today = new Date().toISOString().split("T")[0];
//     const currentStreak = activityService.getCurrentStreak();
//     const [todayActivities, totalDuration] = await Promise.all([
//       activityService.getTodayActivities(),
//       activityService.getTotalDurationByDate(today),
//     ]);

//     setActivities(todayActivities as Activity[]);
//     setStudyDuration(totalDuration);
//     setStreak(currentStreak);
//   }, []);

//   useEffect(() => {
//     void loadActivities();
//   }, [loadActivities]);

//   useFocusEffect(
//     useCallback(() => {
//       void loadActivities();
//     }, [loadActivities]),
//   );

//   return (
//     <SafeAreaView
//       style={{ flex: 1 }}
//       edges={["top"]}
//       className="flex-1 bg-background"
//     >
//       <Header />
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ padding: 16 }}
//         className="bg-background"
//       >
//         {/* Greeting */}
//         <View className="mb-6">
//           <Text className="text-3xl font-bold text-text">{getGreeting()}</Text>
//           <View className="mt-2 flex flex-row justify-between items-center">
//             <Text className="text-text-secondary">
//               Let's make today productive
//             </Text>

//             <Text className="bg-surface rounded-2xl px-4 py-2 text-text-secondary">
//               {getFormattedDate()}
//             </Text>
//           </View>
//         </View>

//         {/* Summary */}
//         {/* <View className="mb-6 rounded-3xl border border-white/10 bg-card p-5">
//           <Text className="mb-4 text-lg font-semibold text-text">
//             Today's Overview
//           </Text>

//           <View className="flex-row justify-between gap-3">
//             <View className="flex-1 rounded-2xl bg-surface/80 p-4">
//               <Text className="text-3xl font-bold text-primary">
//                 {formatDuration(studyDuration)}
//               </Text>
//               <Text className="mt-1 text-text-secondary">Study Time</Text>
//             </View>

//             <View className="flex-1 rounded-2xl bg-surface/80 p-4">
//               <Text className="text-3xl font-bold text-primary">
//                 {activities.length}
//               </Text>
//               <Text className="mt-1 text-text-secondary">Activities</Text>
//             </View>
//           </View>
//         </View> */}

//         <View className="mb-6 overflow-hidden rounded-3xl bg-card p-6 border border-white/10">
//           <View className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10" />

//           <Text className="text-text-secondary text-sm">Today's Overview</Text>

//           <Text className="mt-3 text-5xl font-extrabold text-text">
//             {formatDuration(studyDuration)}
//           </Text>

//           <Text className="mt-1 text-text-secondary">Total Study Time</Text>

//           <View className="my-5 h-px bg-white/10" />

//           <View className="flex-row justify-between">
//             <View className="items-center">
//               <Ionicons name="albums-outline" size={20} color="#60A5FA" />

//               <Text className="mt-2 text-2xl font-bold text-text">
//                 {activities.length}
//               </Text>

//               <Text className="text-text-secondary text-xs">Activities</Text>
//             </View>

//             <View className="items-center">
//               <Ionicons name="time-outline" size={20} color="#60A5FA" />

//               <Text className="mt-2 text-2xl font-bold text-text">
//                 {activities.length === 0
//                   ? "0m"
//                   : formatDuration(
//                       Math.round(studyDuration / activities.length),
//                     )}
//               </Text>

//               <Text className="text-text-secondary text-xs">Avg Session</Text>
//             </View>

//             <View className="items-center">
//               <Ionicons name="flame-outline" size={20} color="#60A5FA" />

//               <Text className="mt-2 text-2xl font-bold text-text">
//                 {streak}
//               </Text>

//               <Text className="text-text-secondary text-xs">Streak</Text>
//             </View>
//           </View>
//         </View>

//         {/* Quotes */}
//         <View className="flex flex-row mb-6 justify-center items-center">
//           <QuoteCard />
//         </View>

//         {/* Quick Actions */}
//         <View className="mb-8 flex-row gap-3">
//           <Pressable
//             onPress={() => router.push("/activity/create")}
//             className="flex-1 items-center rounded-2xl border border-primary/30 bg-primary/15 py-4"
//           >
//             <Text className="font-semibold text-primary">+ Add Activity</Text>
//           </Pressable>

//           <Pressable
//             onPress={() => router.push("/activity")}
//             className="flex-1 items-center rounded-2xl border border-white/10 bg-card py-4"
//           >
//             <Text className="font-semibold text-text">History</Text>
//           </Pressable>
//         </View>

//         {/* Recent Activities */}
//         <Text className="mb-4 text-xl font-semibold text-text">
//           Today's Activities
//         </Text>

//         {activities.length === 0 ? (
//           <View className="mb-3 rounded-2xl border border-white/10 bg-card p-4">
//             <Text className="text-text-secondary">
//               No activities logged yet.
//             </Text>
//           </View>
//         ) : (
//           activities.map((item) => (
//             <View
//               key={item.id}
//               className="mb-3 rounded-2xl border border-white/10 bg-card p-4"
//             >
//               <View className="mb-2 flex-row items-center">
//                 <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-primary/15">
//                   <Ionicons
//                     name={categoryIcons[item.category] ?? "book-outline"}
//                     size={18}
//                     color="#3b82f6"
//                   />
//                 </View>
//                 <Text className="text-text-secondary">{item.category}</Text>
//               </View>

//               <Text className="mt-1 text-lg font-semibold text-text">
//                 {item.title}
//               </Text>

//               <Text className="mt-2 font-medium text-primary">
//                 {item.duration} min
//               </Text>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// export const Header = () => {
//   return (
//     <View className="h-16 bg-background flex-row justify-between items-center px-4 py-4 border-b border-b-zinc-800">
//       <Text className="text-text text-3xl font-extrabold">StudyOS</Text>
//       <Ionicons name="person" color={"white"} size={24} />
//     </View>
//   );
// };

// {
//   /*

//   <HeroCard
//   studyDuration={studyDuration}
//   activitiesCount={activities.length}
//   streak={streak}
// />

//   */
// }

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
      >
        <Text className="text-4xl font-light text-white">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
