import { Header } from "@/components/assignment/Header";
import {
  deleteAssignment,
  getAssignmentById,
  updateAssignmentCompletion,
} from "@/database/assignmentService";
import { Assignment } from "@/types/assignment";
import { getDueInDays } from "@/utils/getDueInDays";
import { getSubjectColor } from "@/utils/getSubjectColor";
import { getSubjectName } from "@/utils/getSubjectName";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AssignmentDetails = () => {
  const { id } = useLocalSearchParams();

  // const assignment = getAssignmentById(Number(id));

  const [assignment, setAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    loadAssignment();
  }, []);

  const loadAssignment = async () => {
    const data = await getAssignmentById(Number(id));
    setAssignment(data);
  };

  const router = useRouter();

  const handleOpenPdf = () => {
    if (!assignment?.attachmentUri) return;

    router.push({
      pathname: "/(tabs)/assignment/pdf",
      params: {
        uri: assignment.attachmentUri,
      },
    });
  };

  const handleDelete = () => {
    if (!assignment) return;

    Alert.alert(
      "Delete assignment",
      "Are you sure you want to delete this assignment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteAssignment(assignment.id);
            router.push("/(tabs)/assignment");
          },
        },
      ],
    );
  };

  const handleAssignmentCompletionUpdate = async () => {
    if (!assignment) return;
    await updateAssignmentCompletion(
      assignment?.completed ? false : true,
      assignment?.id,
    );
    await loadAssignment();
    router.replace("/(tabs)/assignment");
  };

  if (!assignment) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      className="flex-1 bg-background"
      edges={["top"]}
    >
      <View className="bg-background flex-1">
        <Header handleDelete={handleDelete} />

        <View className="flex-1 p-5 gap-y-5">
          {/* Subject */}
          <View
            className="self-start rounded-full px-4 py-2"
            style={{
              backgroundColor: getSubjectColor(assignment.subjectId),
            }}
          >
            <Text className="text-white font-semibold">
              {getSubjectName(assignment.subjectId)}
            </Text>
          </View>

          {/* Title */}
          <Text className="text-text text-3xl font-bold">
            {assignment.title}
          </Text>

          {/* Due */}
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={20} color="white" />
            <Text className="text-muted ml-2">
              {getDueInDays(assignment.dueDate)}
            </Text>
          </View>

          {/* Priority */}
          <View className="flex-row items-center">
            <Ionicons name="school-outline" size={20} color="white" />
            <Text className="text-text ml-2">{assignment.priority}</Text>
          </View>

          {/* Attachment */}
          <View className="mt-3">
            <Text className="text-text font-semibold mb-2">Attachment</Text>

            {assignment.attachmentName ? (
              <Pressable
                onPress={handleOpenPdf}
                className="bg-surface rounded-2xl p-4 flex-row items-center mt-1"
              >
                <Ionicons
                  name="document-text-outline"
                  color="white"
                  size={24}
                />

                <View className="ml-3 flex-1">
                  <Text className="text-white" numberOfLines={1}>
                    {assignment.attachmentName}
                  </Text>

                  <Text className="text-muted text-xs">PDF Document</Text>
                </View>

                <Ionicons name="chevron-forward" color="white" size={20} />
              </Pressable>
            ) : (
              <Text className="text-muted">No attachment added.</Text>
            )}
          </View>

          {/* Status */}
          <View className="mt-auto space-y-3">
            <Pressable
              onPress={handleAssignmentCompletionUpdate}
              className="bg-primary rounded-2xl py-4 items-center"
            >
              <Text className="text-white font-semibold">
                {assignment.completed
                  ? "Mark as Incomplete"
                  : "Mark as Completed"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AssignmentDetails;
