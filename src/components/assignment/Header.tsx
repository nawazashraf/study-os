import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export const Header = ({ handleDelete }: { handleDelete: () => void }) => {
  const router = useRouter();
  return (
    <View className="h-14 px-4 flex flex-row justify-between items-center  bg-[#101112] shadow-2xl shadow-zinc-800 drop-shadow-md">
      <View className="flex flex-row gap-x-6">
        <Pressable
          className="flex h-full justify-center items-center"
          onPress={() => {
            if (router.canGoBack && router.canGoBack()) router.back();
            else router.replace("/(tabs)/assignment");
          }}
        >
          <Ionicons name="chevron-back-outline" color={"white"} size={18} />
        </Pressable>
        <View className="h-full flex justify-center">
          <Text className="text-text font-bold text-lg">New Assignment</Text>
          <Text className="text-muted text-xs">Organize your coursework</Text>
        </View>
      </View>

      <Pressable
        onPress={handleDelete}
        className="rounded-full size-8 flex flex-row justify-center items-center"
      >
        <Ionicons name="trash" color={"red"} size={24} />
      </Pressable>
    </View>
  );
};
