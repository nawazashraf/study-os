import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Action = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
};

const actions: Action[] = [
  {
    title: "Add Activity",
    subtitle: "Log today's work",
    icon: "add-circle-outline",
    route: "/activity/create",
    color: "#3B82F6",
  },
  {
    title: "History",
    subtitle: "View all logs",
    icon: "time-outline",
    route: "/activity",
    color: "#10B981",
  },
  {
    title: "Assignments",
    subtitle: "Manage tasks",
    icon: "document-text-outline",
    route: "/assignment",
    color: "#F59E0B",
  },
  {
    title: "Syllabus",
    subtitle: "Continue learning",
    icon: "book-outline",
    route: "/syllabus",
    color: "#8B5CF6",
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <View className="mb-8">
      <Text className="mb-4 text-xl font-bold text-text">Quick Actions</Text>

      <View className="flex-row flex-wrap justify-between">
        {actions.map((action) => (
          <Pressable
            key={action.title}
            onPress={() => router.push(action.route as never)}
            android_ripple={{ color: "#ffffff15" }}
            className="mb-4 w-[48%] rounded-3xl border border-white/10 bg-card p-5"
          >
            <View
              className="h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${action.color}20`,
              }}
            >
              <Ionicons name={action.icon} size={22} color={action.color} />
            </View>

            <Text className="mt-5 text-lg font-semibold text-text">
              {action.title}
            </Text>

            <Text className="mt-1 text-sm text-text-secondary">
              {action.subtitle}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
