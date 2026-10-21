import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getUserName } from "@/utils/userPreferences";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { getGreeting } from "@/utils/getGreeting";
import { Ionicons } from "@expo/vector-icons";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserNameState] = useState<string | null>(null);

  useEffect(() => {
    getUserName().then((name) => {
      if (!name) {
        router.replace("/onboarding");
        return;
      }
      setUserNameState(name);
    });
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-6">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-bold uppercase tracking-[0.3em] text-muted">
            {getGreeting()}
          </Text>
          <Text className="mt-2 text-4xl font-bold text-white">
            {userName ? `Hello, ${userName}` : "Welcome"}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/routine")}
          className="rounded-3xl bg-primary px-4 py-3"
        >
          <Text className="font-bold text-white">View Routine</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
