import { deleteNote } from "@/database/noteService";
import { NoteType } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export const NoteCard = ({
  item,
  onDelete,
}: {
  item: NoteType;
  onDelete: () => void;
}) => {
  const handleNoteDelete = (id: number) => {
    try {
      deleteNote(id);
      onDelete();
      console.log("Note Deleted ");
    } catch (error) {
      console.log("something went wrong while deleting note" + error);
    }
  };
  const [isCompleted, setIsCompleted] = useState(false);

  const router = useRouter();
  const handleNoteEdit = () => {
    router.push({
      pathname: "/(tabs)/notes/[id]",
      params: {
        id: item.id.toString(),
      },
    });
  };
  return (
    <Pressable
      className={`${isCompleted ? "opacity-50" : ""} flex flex-row gap-x-2 w-full bg-[#1A1A1A] my-1 h-28 rounded-2xl px-6 py-4 border border-zinc-700`}
      onPress={() => handleNoteEdit()}
    >
      {/* IsCompleted Button */}
      <Pressable
        className="flex justify-center items-center mr-2"
        onPress={() => setIsCompleted((prev) => !prev)}
      >
        <View
          className={`${isCompleted ? "border-2 bg-green-500" : ""} border-2 border-green-500 rounded-full size-6`}
        />
      </Pressable>
      {/* Note */}
      <View className="flex flex-1">
        <Text
          className={`${isCompleted ? "line-through" : ""} text-muted text-sm font-bold`}
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={2}
          className={`${isCompleted ? "line-through" : ""} mt-1 text-white text-lg font-bold leading-tight`}
        >
          {item.description}
        </Text>
      </View>
      {/* Delete Button */}
      <View className="min-w-6 flex justify-center items-center">
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            handleNoteDelete(item.id);
          }}
        >
          <Ionicons name="trash-bin" color={"red"} size={18} />
        </Pressable>
      </View>
    </Pressable>
  );
};
