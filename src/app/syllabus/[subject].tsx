import syllabus from "@/data/syllabus.json";
import { getSubjectProgress } from "@/database/syllabusService";
import { useProgress } from "@/hooks/useProgress";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubjectScreen() {
  const { subject } = useLocalSearchParams<{
    subject: string;
  }>();

  const { completed } = useProgress();

  const currentSubject = syllabus.subjects.find((s) => s.id === subject);

  if (!currentSubject) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-white text-lg">Subject not found</Text>
      </View>
    );
  }

  const progress = getSubjectProgress(currentSubject, completed);

  const moduleProgress =
    progress.totalModules === 0
      ? 0
      : (progress.completedModules / progress.totalModules) * 100;

  const topicProgress =
    progress.totalTopics === 0
      ? 0
      : (progress.completedTopics / progress.totalTopics) * 100;

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <View className="flex-1 p-5">
        {/* Header */}
        <View>
          <View className="flex-row items-center justify-between">
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: progress.color }}
            >
              <Text className="font-semibold text-white">
                {currentSubject.code}
              </Text>
            </View>

            <Text className="text-zinc-400">
              {currentSubject.credits}{" "}
              {currentSubject.credits === 1 ? "Credit" : "Credits"}
            </Text>

            <Text className="text-zinc-400">
              {currentSubject.studyHours} hrs
            </Text>
          </View>

          <Text className="mt-4 text-4xl font-bold text-white">
            {currentSubject.name}
          </Text>
        </View>

        {/* Progress Card */}
        <View className="mt-8 rounded-3xl bg-surface p-6">
          {/* Donut */}
          <View className="items-center">
            <PieChart
              donut
              radius={90}
              innerRadius={65}
              strokeWidth={16}
              data={[
                {
                  value: Math.max(progress.percentage, 0.1),
                  color: progress.color,
                },
                {
                  value: Math.max(100 - progress.percentage, 0.1),
                  color: "#3f3f46",
                },
              ]}
              centerLabelComponent={() => (
                <View className="items-center">
                  <Text className="text-3xl font-bold text-black">
                    {progress.percentage}%
                  </Text>

                  <Text className="mt-1 text-xs text-zinc-400">Completed</Text>
                </View>
              )}
            />
          </View>

          {/* Module Progress */}
          <View className="mt-10">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-base font-medium text-white">Modules</Text>

              <Text className="text-sm text-zinc-400">
                {progress.completedModules}/{progress.totalModules}
              </Text>
            </View>

            <View className="h-2 overflow-hidden rounded-full bg-zinc-700">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${moduleProgress}%`,
                  backgroundColor: progress.color,
                }}
              />
            </View>
          </View>

          {/* Topic Progress */}
          <View className="mt-6">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-base font-medium text-white">Topics</Text>

              <Text className="text-sm text-zinc-400">
                {progress.completedTopics}/{progress.totalTopics}
              </Text>
            </View>

            <View className="h-2 overflow-hidden rounded-full bg-zinc-700">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${topicProgress}%`,
                  backgroundColor: progress.color,
                }}
              />
            </View>
          </View>

          {/* Summary */}
          <View className="mt-10 flex-row justify-between rounded-2xl bg-background px-5 py-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-white">
                {progress.completedTopics}
              </Text>
              <Text className="mt-1 text-xs text-zinc-400">Completed</Text>
            </View>

            <View className="items-center">
              <Text className="text-2xl font-bold text-white">
                {progress.totalTopics - progress.completedTopics}
              </Text>
              <Text className="mt-1 text-xs text-zinc-400">Remaining</Text>
            </View>

            <View className="items-center">
              <Text
                className="text-2xl font-bold"
                style={{ color: progress.color }}
              >
                {progress.percentage}%
              </Text>
              <Text className="mt-1 text-xs text-zinc-400">Overall</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
