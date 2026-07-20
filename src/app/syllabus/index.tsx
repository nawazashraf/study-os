import { useProgress } from "@/hooks/useProgress";
import { SubjectWithProgress, SyllabusHeaderProps } from "@/types/syllabus";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const Syllabus = () => {
  const { semester, subjects } = useProgress();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View className="flex-1 px-4 py-4">
        <FlatList
          ListHeaderComponent={
            <SyllabusHeader
              syllabusCoverage={semester.percentage}
              subjectCompleted={semester.completedSubjects}
              totalSubject={semester.totalSubjects}
            />
          }
          data={subjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SubjectCard item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export const SyllabusHeader = ({
  syllabusCoverage,
  subjectCompleted,
  totalSubject,
}: SyllabusHeaderProps) => {
  return (
    <View>
      {/* Heading */}
      <View>
        <Text className="text-text text-4xl font-bold">Learning Path</Text>
        <Text className="text-muted tracking-wide text-base">
          Track your syllabus progress throughout the semester.
        </Text>
      </View>
      {/* Syllabus coverage card */}
      <View className="bg-surface mt-4 px-6 py-4 rounded-3xl">
        <Text className="text-primary font-extrabold text-base">
          OVERALL SEMESTER
        </Text>
        <Text className="text-text text-5xl font-extrabold mt-1">
          {syllabusCoverage}%
        </Text>
        {/* Syllabus coverage % */}
        <View className="my-2 bg-zinc-700 h-2 w-full rounded-full overflow-hidden">
          <View
            style={{
              width: `${syllabusCoverage}%`,
            }}
            className="bg-primary  h-full"
          />
        </View>
        <View className="bg-zinc-700 px-4 py-3 rounded-2xl mt-2">
          <Text className="text-muted font-bold">COMPLETED</Text>
          <Text className="text-white font-bold text-lg">
            {subjectCompleted}/{totalSubject} Subjects
          </Text>
        </View>
      </View>
    </View>
  );
};

export const SubjectCard = ({ item }: { item: SubjectWithProgress }) => {
  const progress =
    item.totalModules === 0
      ? 0
      : Math.max((item.completedModules / item.totalModules) * 100, 4);
  const handleSubjectPress = () => {
    router.push({
      pathname: "/syllabus/[subject]",
      params: {
        subject: item.id,
      },
    });
  };
  return (
    <Pressable
      onPress={handleSubjectPress}
      className="my-2 rounded-3xl bg-surface p-4 border border-border/20"
    >
      <View className="flex-row items-center">
        <View
          className="h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${item.color}20` }}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={28}
            color={item.color}
          />
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-text text-lg font-bold" numberOfLines={2}>
            {item.name}
          </Text>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-text/60 text-sm">{item.code}</Text>
            <Text className="text-muted text-sm font-medium text-secondary mr-4">
              {item.credits} Credits
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap">
        <View className="mr-2 rounded-full bg-primary/10 px-3 py-1">
          <Text className="text-xs font-medium text-primary">
            {item.type.toUpperCase()}
          </Text>
        </View>

        <View className="rounded-full bg-success/10 px-3 py-1">
          <Text className="text-xs font-medium text-success">
            Module {item.completedModules} / {item.totalModules}
          </Text>
        </View>
        <View className="mt-2 rounded-full overflow-hidden h-1 w-full bg-surface">
          <View
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: item.color,
            }}
          />
        </View>
      </View>
    </Pressable>
  );
};

// export const Header = () => {
//   return <View className="bg-surface">

//   </View>;
// };

export default Syllabus;

{
  /*
  Subject Screen
const { completed } = useProgress();

const progress = getSubjectProgress(subject, completed);
Module Screen
const { completed } = useProgress();

const progress = getModuleProgress(module, completed);
  
  */
}
