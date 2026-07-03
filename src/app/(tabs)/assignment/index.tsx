import { AssignmentCard } from "@/components/assignment/AssignmentCard";
import { useAssignment } from "@/hooks/useAssignment";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAssignment = () => {
  const { assignment, refreshAssignment } = useAssignment();
  console.log(assignment);

  useFocusEffect(
    useCallback(() => {
      refreshAssignment();
    }, [refreshAssignment]),
  );

  const router = useRouter();

  const handleAddAssignmentPress = () => {
    router.push("/(tabs)/assignment/create");
  };
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
      }}
      className=""
    >
      <View className="flex-1 bg-background py-2">
        <AssignmentHeader />
        <Pressable
          onPress={handleAddAssignmentPress}
          className="absolute z-50 bottom-4 right-6 bg-primary size-16 rounded-full flex justify-center items-center"
        >
          <Ionicons
            name="add"
            color={"white"}
            style={{
              fontSize: 50,
              fontWeight: 700,
            }}
          />
        </Pressable>
        <View className="flex-1 px-4 bg-background py-2 gap-y-4">
          {/* {assignment.map((item) => (
            <AssignmentCard key={item.id} data={item} />
          ))} */}

          <FlatList
            data={assignment}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AssignmentCard data={item} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export const AssignmentHeader = () => {
  const { assignment } = useAssignment();

  return (
    <View className="flex flex-row items-center justify-between border-b border-zinc-700 px-4 pb-2">
      <View>
        <Text className="text-primary text-lg font-bold">Assignments</Text>
        <Text className="text-muted">{assignment.length} Pending</Text>
      </View>
      <View className="flex flex-row justify-around gap-x-4">
        <Ionicons name="search" color={"white"} size={18} />
        <Ionicons name="menu" color={"white"} size={18} />
        <Ionicons name="person" color={"white"} size={18} />
      </View>
    </View>
  );
};

export default CreateAssignment;
