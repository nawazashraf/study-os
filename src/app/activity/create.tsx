import { activityService } from "@/database/activityService";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const categories = ["DSA", "Development", "Core Subject", "Skill"] as const;

export default function CreateActivity() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("DSA");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const parsedDuration = Number(duration);

    if (!trimmedTitle || Number.isNaN(parsedDuration) || parsedDuration <= 0) {
      return;
    }

    await activityService.createActivity({
      category,
      title: trimmedTitle,
      duration: parsedDuration,
      notes: notes.trim() ? notes.trim() : undefined,
      activityDate: new Date().toISOString().split("T")[0],
    });

    if (router.canGoBack && router.canGoBack()) {
      router.back();
    } else {
      router.replace("/activity");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#252525" }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View
          className="flex-1"
          style={{
            backgroundColor: "#252525",
          }}
        >
          <View className="flex-row items-center justify-between px-5 py-4">
            <Text className="text-2xl font-bold text-text">Add Activity</Text>
            <Pressable
              onPress={handleSave}
              className="rounded-full bg-primary px-4 py-2"
            >
              <Text className="font-semibold text-background">Save</Text>
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 24 + insets.bottom,
            }}
            className="flex-1"
            style={{ backgroundColor: "#252525" }}
          >
            <Text className="text-muted mt-1 mb-8">Log today's learning.</Text>

            <Text className="text-text font-semibold mb-2">Activity</Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What did you work on?"
              placeholderTextColor="#9ca3af"
              selectionColor="#3b82f6"
              className="mb-6 rounded-2xl bg-surface px-4 py-4 text-text"
            />

            <Text className="text-text font-semibold mb-3">Category</Text>

            <View className="mb-6 flex-row flex-wrap gap-3">
              {categories.map((item) => {
                const isActive = category === item;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    className={`rounded-full px-5 py-3 ${
                      isActive ? "bg-primary" : "bg-surface"
                    }`}
                  >
                    <Text
                      className={
                        isActive
                          ? "font-semibold text-background"
                          : "font-semibold text-text"
                      }
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text className="text-text font-semibold mb-2">
              Duration (minutes)
            </Text>

            <TextInput
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="90"
              placeholderTextColor="#9ca3af"
              selectionColor="#3b82f6"
              className="mb-6 rounded-2xl bg-surface px-4 py-4 text-text"
            />

            <Text className="text-text font-semibold mb-2">
              Notes (Optional)
            </Text>

            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Write anything you learned today..."
              placeholderTextColor="#9ca3af"
              selectionColor="#3b82f6"
              className="mb-2 min-h-36 rounded-2xl bg-surface px-4 py-4 text-text"
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
