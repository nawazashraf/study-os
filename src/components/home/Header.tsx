import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function Header() {
  return (
    <View className="h-16 flex-row items-center justify-between border-b border-zinc-800 bg-background px-4">
      <Text className="text-3xl font-extrabold text-text">StudyOS</Text>

      <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-surface">
        <Ionicons name="settings-outline" size={22} color="white" />
      </Pressable>
    </View>
  );
}
