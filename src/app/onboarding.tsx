import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { getUserName, setUserName } from "@/utils/userPreferences";

export default function Onboarding() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getUserName().then((storedName) => {
      if (storedName) {
        router.replace("/home");
      } else {
        setIsReady(true);
      }
    });
  }, [router]);

  const handleContinue = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    await setUserName(trimmedName);
    router.replace("/home");
  };

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-6 pt-8">
      <View className="flex-1 justify-center gap-6">
        <View>
          <Text className="text-4xl font-bold text-white">Welcome!</Text>
          <Text className="mt-2 text-base text-muted">
            Start by entering your name so we can personalize your routine.
          </Text>
        </View>

        <View className="space-y-3">
          <Text className="text-sm font-bold text-muted">YOUR NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#9ca3af"
            className="rounded-3xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-white"
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </View>

        <Pressable
          onPress={handleContinue}
          className="rounded-3xl bg-primary px-5 py-4"
          style={Platform.select({
            android: { elevation: 2 },
            ios: { shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8 },
          })}
        >
          <Text className="text-center text-base font-bold text-white">
            Continue
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
