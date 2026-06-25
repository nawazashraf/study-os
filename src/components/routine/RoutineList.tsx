import { RoutineListProps } from "@/types/routine/routine-list";
import { FlatList, Text, View } from "react-native";

export const RoutineList = ({ classes }: RoutineListProps) => {
  return (
    <FlatList
      data={classes}
      className="flex-1"
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View
          className={`bg-surface my-3 px-6 py-3 rounded-2xl min-h-28 flex justify-center`}
        >
          <View className="flex-row justify-between">
            <Text className="text-white text-xl max-w-48">{item.subject}</Text>

            <Text className="text-muted text-xs">
              {item.start} - {item.end}
            </Text>
          </View>

          <View className="mt-2 flex flex-row justify-between">
            <Text className="text-muted">Room: {item.room}</Text>
            <Text className="text-muted">
              {item.teacher && "Prof : "} {item.teacher}
            </Text>
          </View>
        </View>
      )}
    />
  );
};
