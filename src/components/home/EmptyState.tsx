import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function EmptyState() {
  const router = useRouter();

  return (
    <View className="items-center rounded-3xl border border-white/10 bg-card px-6 py-10">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <Ionicons name="book-outline" size={36} color="#60A5FA" />
      </View>

      <Text className="mt-6 text-xl font-bold text-text">
        No activities today
      </Text>

      <Text className="mt-2 text-center leading-6 text-text-secondary">
        Start logging your study sessions to build consistency and keep your
        streak alive.
      </Text>

      <Pressable
        onPress={() => router.push("/activity/create")}
        className="mt-8 flex-row items-center rounded-2xl bg-primary px-6 py-4"
      >
        <Ionicons name="add" size={20} color="white" />

        <Text className="ml-2 font-semibold text-white">
          Add First Activity
        </Text>
      </Pressable>
    </View>
  );
}
