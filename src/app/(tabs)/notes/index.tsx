import { NoteCard } from "@/components/notes/NoteCard";
import { getNotes } from "@/database/noteService";
import { NoteType } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Note = () => {
  const [allNotes, setAllNotes] = useState<NoteType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const fetchNotes = () => {
    const notes = getNotes();
    setAllNotes(notes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  console.log(allNotes);
  const handleNewNote = () => {
    router.push("/(tabs)/notes/create");
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, []),
  );

  const filteredNotes = allNotes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View className="px-4 bg-background flex flex-1">
        {/* Header */}
        <View className="mt-2">
          {/* Heading Text */}
          <Text className="text-primary font-bold">WORKFLOW</Text>
          {/* Heading and Add Task Button */}
          <View className="mt-2 flex flex-row justify-between">
            <Text className="text-2xl font-bold text-white">ToDo Tasks </Text>
            <Pressable
              onPress={handleNewNote}
              className="bg-primary flex justify-center items-center px-4 py-2.5 rounded-2xl"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View className="flex flex-row gap-x-2 justify-center items-center">
                <Ionicons name="add" size={18} />
                <Text className="font-light text-md">New Task</Text>
              </View>
            </Pressable>
          </View>
          {/* Searchbar */}
          <View className="mt-4 flex-row items-center bg-zinc-800 rounded-full px-4 py-0.5 border border-zinc-600">
            <Ionicons name="search" size={20} color="white" />

            <TextInput
              placeholder="Search for tasks"
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-white"
              value={searchQuery}
              onChangeText={(value) => setSearchQuery(value)}
            />
          </View>
        </View>
        {/* Notes */}
        <View className="flex-1 mt-4">
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={() => (
              <View>
                <Text className="text-white">Empty Notes</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <NoteCard item={item} onDelete={fetchNotes} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Note;
