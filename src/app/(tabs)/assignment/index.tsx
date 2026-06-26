import { AssignmentCard } from "@/components/assignment/AssignmentCard";
import { useAssignment } from "@/hooks/useAssignment";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAssignment = () => {
  const { fileUri, fileName, mimeType } = useLocalSearchParams();

  console.log(fileUri);
  console.log(fileName);
  console.log(mimeType);

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
      <View className="flex-1 bg-background px-4 py-2">
        <Text className="text-white">Hi assignment screen</Text>
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
        <View className="flex-1 bg-background py-2">
          {assignment.map((item) => (
            <AssignmentCard key={item.id} data={item} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateAssignment;
