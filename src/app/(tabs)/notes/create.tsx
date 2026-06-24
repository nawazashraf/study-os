import { createNote } from "@/database/noteService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function AddNote() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [note, setNote] = useState({
    title: "",
    description: "",
  });

  const handleTextInput = (field: "title" | "description", value: string) => {
    setNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNoteSave = () => {
    try {
      const title = note.title.trim();

      if (!title) return;

      createNote(title, note.description.trim());

      router.back();
    } catch (error) {
      console.error("Something went wrong while saving note", error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#252525",
      }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          className="flex-1 px-6"
          style={{
            backgroundColor: "#252525",
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between py-3">
            <Pressable
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              className="h-10 w-10 rounded-full bg-surface items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </Pressable>

            <Pressable
              accessibilityLabel="Save note"
              onPress={handleNoteSave}
              className="px-4 py-2 rounded-xl"
            >
              <Text className="text-primary text-base font-semibold">Save</Text>
            </Pressable>
          </View>

          {/* Date */}
          <Text className="text-muted text-sm mb-4">
            {new Date().toLocaleDateString()}
          </Text>

          {/* Title */}
          <TextInput
            placeholder="Untitled"
            placeholderTextColor="#6b7280"
            value={note.title}
            onChangeText={(value) => handleTextInput("title", value)}
            className="text-white text-4xl font-bold"
            selectionColor="#3b82f6"
          />

          {/* Divider */}
          <View className="h-px bg-surface my-5" />

          {/* Editor */}
          <View className="flex-1">
            <TextInput
              placeholder="Start writing..."
              placeholderTextColor="#6b7280"
              value={note.description}
              onChangeText={(value) => handleTextInput("description", value)}
              multiline
              textAlignVertical="top"
              className="flex-1 text-white text-base leading-7"
              selectionColor="#3b82f6"
            />
          </View>

          {/* Footer */}
          <View
            style={{
              paddingBottom: Math.max(insets.bottom, 12),
            }}
          >
            <Text className="text-muted text-xs">
              {note.description.length} characters
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
