import { getNotes } from "@/database/noteService";
import { NoteType } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Note = () => {
  const [allNotes, setAllNotes] = useState<NoteType[]>([]);

  const fetchNotes = () => {
    const notes = getNotes();
    setAllNotes(notes);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="px-4">
        {/* Header */}
        <View className="mt-2">
          <Text className="text-primary font-bold">WORKFLOW</Text>
          <View className="mt-2 flex flex-row justify-between">
            <Text className="text-2xl font-bold">ToDo Tasks </Text>
            <Pressable className="">
              <View className="flex flex-row justify-center items-center">
                <Ionicons name="add" size={18} />
                <Text className="font-bold text-xl">New Task</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Note;
