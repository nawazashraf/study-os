import type { Activity } from "@/types/activity";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  DSA: "construct-outline",
  Development: "code-slash-outline",
  "Core Subject": "book-outline",
  Skill: "sparkles-outline",
};

const categoryColors: Record<string, string> = {
  DSA: "#3B82F6",
  Development: "#10B981",
  "Core Subject": "#F59E0B",
  Skill: "#8B5CF6",
};

type Props = {
  activity: Activity;
  onPress?: () => void;
  onMorePress?: () => void;
};

export default function ActivityCard({
  activity,
  onPress,
  onMorePress,
}: Props) {
  const color = categoryColors[activity.category] ?? "#3B82F6";

  return (
    <Pressable
      onPress={onPress}
      className="mb-4 rounded-3xl border border-white/10 bg-card p-5 active:opacity-80"
    >
      {/* Top Row */}

      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row items-start">
          <View
            className="mr-3 h-11 w-11 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: `${color}20`,
            }}
          >
            <Ionicons
              name={categoryIcons[activity.category] ?? "book-outline"}
              size={20}
              color={color}
            />
          </View>

          <View className="flex-1">
            <Text className="text-sm text-text-secondary">
              {activity.category}
            </Text>

            <Text
              numberOfLines={2}
              className="mt-1 text-lg font-semibold text-text"
            >
              {activity.title}
            </Text>
          </View>
        </View>

        <Pressable hitSlop={8} onPress={onMorePress} className="mt-1">
          <Ionicons name="ellipsis-vertical" size={18} color="#888" />
        </Pressable>
      </View>

      {/* Notes */}

      {activity.notes ? (
        <Text numberOfLines={2} className="mt-4 text-text-secondary">
          {activity.notes}
        </Text>
      ) : null}

      {/* Footer */}

      <View className="mt-5 flex-row items-center justify-between">
        <View
          className="flex-row items-center rounded-full px-3 py-1.5"
          style={{
            backgroundColor: `${color}15`,
          }}
        >
          <Ionicons name="time-outline" size={14} color={color} />

          <Text className="ml-1.5 font-medium" style={{ color }}>
            {activity.duration} min
          </Text>
        </View>

        <Text className="text-xs text-text-secondary">
          {activity.activityDate}
        </Text>
      </View>
    </Pressable>
  );
}
