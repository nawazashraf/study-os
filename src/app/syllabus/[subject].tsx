import syllabus from "@/data/syllabus.json";
import {
  getSubjectProgress,
  markTopicComplete,
  markTopicIncomplete,
} from "@/database/syllabusService";
import { useProgress } from "@/hooks/useProgress";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const SubjectScreen = () => {
  const { subject } = useLocalSearchParams<{ subject: string }>();

  const { completed, refresh } = useProgress();

  const [busyTopic, setBusyTopic] = useState<string | null>(null);

  const currentSubject = useMemo(
    () => syllabus.subjects.find((item) => item.id === subject),
    [subject],
  );

  const progress = useMemo(() => {
    if (!currentSubject) return null;
    return getSubjectProgress(currentSubject, completed);
  }, [currentSubject, completed]);

  const handleToggleTopic = async (topicId: string) => {
    if (busyTopic) return;

    setBusyTopic(topicId);

    try {
      if (completed.has(topicId)) {
        await markTopicIncomplete(topicId);
      } else {
        await markTopicComplete(topicId);
      }

      await refresh();
    } finally {
      setBusyTopic(null);
    }
  };

  if (!currentSubject || !progress) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-lg text-white">Subject not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={progress.modules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <SubjectHeader subject={currentSubject} color={progress.color} />

            <ProgressCard progress={progress} />

            <ObjectiveCard objective={currentSubject.objectives} />

            <PrerequisiteCard prerequisites={currentSubject.prerequisites} />

            <View className="mt-8 mb-2 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-white">Modules</Text>

              <Text className="text-zinc-400">{progress.modules.length}</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ModuleCard
            module={item}
            color={progress.color}
            completed={completed}
            busyTopic={busyTopic}
            onToggleTopic={handleToggleTopic}
          />
        )}
        ListFooterComponent={
          <OutcomesCard outcomes={currentSubject.outcomes} />
        }
      />
    </SafeAreaView>
  );
};

export default SubjectScreen;

type SubjectHeaderProps = {
  subject: (typeof syllabus.subjects)[number];
  color: string;
};

const SubjectHeader = ({ subject, color }: SubjectHeaderProps) => {
  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between">
        <View
          className="self-start rounded-full px-4 py-2"
          style={{ backgroundColor: color }}
        >
          <Text className="font-semibold text-white">{subject.code}</Text>
        </View>

        <View className="items-end">
          <Text className="text-zinc-300">
            {subject.credits} {subject.credits === 1 ? "Credit" : "Credits"}
          </Text>

          <Text className="mt-1 text-zinc-500">
            {subject.studyHours ?? 0} hrs
          </Text>
        </View>
      </View>

      <Text className="mt-5 text-3xl font-bold text-white">{subject.name}</Text>
    </View>
  );
};

type ModuleCardProps = {
  module: ReturnType<typeof getSubjectProgress>["modules"][number];
  color: string;
  completed: Set<string>;
  busyTopic: string | null;
  onToggleTopic: (topicId: string) => void;
};

const ModuleCard = ({
  module,
  color,
  completed,
  busyTopic,
  onToggleTopic,
}: ModuleCardProps) => {
  return (
    <View
      className="mt-5 rounded-3xl bg-surface p-5 border-l-4"
      style={{
        borderLeftColor: color,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-xl font-bold text-white">
            {module.roman}. {module.title}
          </Text>

          <Text className="mt-1 text-sm text-zinc-400">
            {module.topics.length} Topics • {module.hours ?? 0} hrs
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-lg font-bold" style={{ color }}>
            {module.progress.percentage}%
          </Text>

          <Text className="text-xs text-zinc-500">
            {module.progress.done}/{module.progress.total}
          </Text>
        </View>
      </View>

      <View className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
        <View
          className="h-full rounded-full"
          style={{
            width: `${module.progress.percentage}%`,
            backgroundColor: color,
          }}
        />
      </View>

      <View className="mt-5 gap-3">
        {module.topics.map((topic) => (
          <TopicItem
            key={topic.id}
            topic={topic}
            completed={completed.has(topic.id)}
            busy={busyTopic === topic.id}
            color={color}
            onPress={() => onToggleTopic(topic.id)}
          />
        ))}
      </View>
    </View>
  );
};

type ProgressCardProps = {
  progress: ReturnType<typeof getSubjectProgress>;
};

const ProgressCard = ({ progress }: ProgressCardProps) => {
  return (
    <View className="mt-2 mb-6 rounded-3xl bg-surface p-6">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm uppercase tracking-[2px] text-zinc-500">
            Progress
          </Text>

          <Text className="mt-2 text-5xl font-extrabold text-white">
            {progress.percentage}%
          </Text>

          <Text className="mt-1 text-zinc-400">
            {progress.completedTopics} of {progress.totalTopics} topics
            completed
          </Text>
        </View>

        <View
          className="h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: `${progress.color}20` }}
        >
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={34}
            color={progress.color}
          />
        </View>
      </View>

      <View className="mt-6 h-2 overflow-hidden rounded-full bg-zinc-800">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress.percentage}%`,
            backgroundColor: progress.color,
          }}
        />
      </View>

      <View className="mt-6 flex-row gap-3">
        <StatCard
          label="Modules"
          value={`${progress.completedModules}/${progress.totalModules}`}
        />

        <StatCard
          label="Topics"
          value={`${progress.completedTopics}/${progress.totalTopics}`}
        />
      </View>
    </View>
  );
};

type StatCardProps = {
  label: string;
  value: string;
};

const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <View className="flex-1 rounded-2xl bg-background p-4">
      <Text className="text-xs uppercase text-zinc-500">{label}</Text>

      <Text className="mt-2 text-2xl font-bold text-white">{value}</Text>
    </View>
  );
};
type TopicItemProps = {
  topic: {
    id: string;
    title: string;
  };
  completed: boolean;
  busy: boolean;
  color: string;
  onPress: () => void;
};

const TopicItem = ({
  topic,
  completed,
  busy,
  color,
  onPress,
}: TopicItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      className="flex-row items-center rounded-2xl bg-background px-4 py-4 active:opacity-80"
    >
      <MaterialCommunityIcons
        name={
          completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"
        }
        size={24}
        color={completed ? color : "#71717a"}
      />

      <Text
        className={`ml-4 flex-1 text-sm ${
          completed ? "text-zinc-500 line-through" : "text-white"
        }`}
      >
        {topic.title}
      </Text>

      {busy ? (
        <MaterialCommunityIcons name="loading" size={18} color="#a1a1aa" />
      ) : completed ? (
        <MaterialCommunityIcons name="check" size={18} color={color} />
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color="#71717a"
        />
      )}
    </Pressable>
  );
};

type ObjectiveCardProps = {
  objective: string;
};

const ObjectiveCard = ({ objective }: ObjectiveCardProps) => {
  return (
    <View className="mt-6 rounded-3xl bg-surface p-5">
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="target" size={22} color="#60A5FA" />

        <Text className="ml-3 text-lg font-semibold text-white">Objective</Text>
      </View>

      <Text className="mt-4 text-sm leading-7 text-zinc-300">{objective}</Text>
    </View>
  );
};

type PrerequisiteCardProps = {
  prerequisites: string[];
};

const PrerequisiteCard = ({ prerequisites }: PrerequisiteCardProps) => {
  if (prerequisites.length === 0) return null;

  return (
    <View className="mt-5 rounded-3xl bg-surface p-5">
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="book-check" size={22} color="#34D399" />

        <Text className="ml-3 text-lg font-semibold text-white">
          Prerequisites
        </Text>
      </View>

      <View className="mt-5 gap-4">
        {prerequisites.map((item, index) => (
          <View key={index} className="flex-row items-start">
            <View className="mt-1.75 h-2 w-2 rounded-full bg-primary" />

            <Text className="ml-3 flex-1 text-sm leading-6 text-zinc-300">
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

type OutcomesCardProps = {
  outcomes: {
    id: string;
    label: string;
    description: string;
  }[];
};

const OutcomesCard = ({ outcomes }: OutcomesCardProps) => {
  return (
    <View className="mt-8">
      <Text className="mb-4 text-2xl font-bold text-white">
        Learning Outcomes
      </Text>

      <View className="gap-4">
        {outcomes.map((item) => (
          <View key={item.id} className="rounded-3xl bg-surface p-5">
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                <MaterialCommunityIcons
                  name="school"
                  size={20}
                  color="#60A5FA"
                />
              </View>

              <Text className="ml-3 flex-1 text-lg font-semibold text-white">
                {item.label}
              </Text>
            </View>

            <Text className="mt-4 text-sm leading-7 text-zinc-300">
              {item.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
