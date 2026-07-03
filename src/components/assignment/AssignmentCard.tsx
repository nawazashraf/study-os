import { STYLES } from "@/data/priorityColor";
import { Assignment } from "@/types/assignment";
import { getDueInDays } from "@/utils/getDueInDays";
import { getSubjectColor } from "@/utils/getSubjectColor";
import { getSubjectName } from "@/utils/getSubjectName";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export const AssignmentCard = ({ data }: { data: Assignment }) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(tabs)/assignment/[id]",
          params: {
            id: data.id,
          },
        })
      }
      className="bg-surface flex flex-row items-center px-4 py-3 rounded-2xl h-28 my-2"
    >
      {/* Icon */}
      <View>
        <Ionicons name="document-outline" color={"white"} size={28} />
      </View>
      {/* Main Content */}
      <View className="flex-1 ml-4 h-full">
        <View
          className="self-start rounded-full px-3 py-1 my-2"
          style={{
            backgroundColor: getSubjectColor(data.subjectId),
          }}
        >
          <Text className="text-white text-sm font-semibold">
            {getSubjectName(data.subjectId)}
          </Text>
        </View>
        <Text className="text-white">{data.title}</Text>
        <Text className="text-muted">{getDueInDays(data.dueDate)}</Text>
      </View>
      {/* Priority  */}
      <View className={`${STYLES["Medium"].bg} px-3 py-2 rounded-full`}>
        <Text className="text-white text-xs">{data.priority}</Text>
      </View>
    </Pressable>
  );
};
