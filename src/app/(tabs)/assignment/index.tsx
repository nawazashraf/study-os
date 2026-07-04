import { AssignmentCard } from "@/components/assignment/AssignmentCard";
import { useAssignment } from "@/hooks/useAssignment";
import { Assignment } from "@/types/assignment";
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

  const pendingAssignment = assignment.filter((item) => !item.completed);
  const completedAssignment = assignment.filter((item) => item.completed);

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
        <AssignmentHeader pendingAssignment={pendingAssignment} />
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
            data={pendingAssignment}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AssignmentCard data={item} />}
            ListFooterComponent={
              <AssignmentFooter completedAssignment={completedAssignment} />
            }
            ListEmptyComponent={<PendingAssignmentEmptyState />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export const AssignmentHeader = ({
  pendingAssignment,
}: {
  pendingAssignment: Assignment[];
}) => {

  return (
    <View className="flex flex-row items-center justify-between border-b border-zinc-700 px-4 pb-2">
      <View>
        <Text className="text-primary text-lg font-bold">Assignments</Text>
        <Text className="text-muted">{pendingAssignment.length} Pending</Text>
      </View>
      <View className="flex flex-row justify-around gap-x-4">
        {/* <Ionicons name="search" color={"white"} size={18} />
        <Ionicons name="menu" color={"white"} size={18} />
        <Ionicons name="person" color={"white"} size={18} /> */}
      </View>
    </View>
  );
};

export const AssignmentFooter = ({
  completedAssignment,
}: {
  completedAssignment: Assignment[];
}) => {
  return (
    <View className="mt-6">
      <Text className="text-text text-lg font-semibold mb-3">
        Recently Completed
      </Text>

      {completedAssignment.length > 0 ? (
        completedAssignment.map((item) => (
          <AssignmentCard key={item.id} data={item} />
        ))
      ) : (
        <View className="items-center justify-center py-8 px-6">
          <Ionicons name="checkmark-circle-outline" size={52} color="#71717a" />

          <Text className="text-text text-lg font-semibold mt-3">
            No completed assignments
          </Text>

          <Text className="text-muted text-center mt-2 leading-6">
            Complete an assignment to see your recent accomplishments here.
          </Text>
        </View>
      )}
    </View>
  );
};

export const PendingAssignmentEmptyState = () => {
  return (
    <View className="h-56 items-center justify-center px-8">
      <Ionicons
        name="checkmark-done-circle-outline"
        size={64}
        color="#22c55e"
      />

      <Text className="mt-4 text-text text-2xl font-bold text-center">
        No assignments pending
      </Text>

      <Text className="mt-2 text-muted text-center leading-6">
        You're all caught up! Enjoy the breather or start planning your next
        project.
      </Text>
    </View>
  );
};

export default CreateAssignment;
