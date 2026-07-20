import { RoutineListProps } from "@/types/routine/routine-list";
import { FlatList, Pressable, Text, View } from "react-native";

export const RoutineList = ({ classes, onClassPress }: RoutineListProps) => {
  return (
    <FlatList
      data={classes}
      className="flex-1"
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onClassPress(item)}
          className="my-3 rounded-2xl bg-surface p-5 border-l-4"
          style={{ borderLeftColor: item.color }}
        >
          <View className="flex-row justify-between items-start">
            <Text
              className="text-white text-xl flex-1 mr-4"
              style={{ color: item.color }}
            >
              {item.subject}
            </Text>

            <Text className="text-white/70 text-xs">
              {item.start} - {item.end}
            </Text>
          </View>

          <View className="mt-3 flex-row justify-between">
            <Text className="text-white/70">
              {item.room ? `Room: ${item.room}` : ""}
            </Text>

            <Text className="text-white/70">
              {item.teacher ? `Prof: ${item.teacher}` : ""}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
};
