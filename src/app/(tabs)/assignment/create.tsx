import DatePicker from "@/components/assignment/DatePicker";
import DocumentCard from "@/components/assignment/DocumentCard";
import DropdownComponent from "@/components/assignment/DropDownComponent";
import FieldLabel from "@/components/assignment/FieldLabel";
import { Header } from "@/components/assignment/Header";
import PrioritySelector from "@/components/assignment/PrioritySelector";
import { createAssignment } from "@/database/assignmentService";
import { AssignmentForm, FormErrors } from "@/types/assignment";
import { validate } from "@/utils/assignmentValidation";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_FORM: AssignmentForm = {
  title: "",
  subjectId: null,
  dueDate: new Date(),
  priority: "",
  attachment: null,
};

const CreateAssignment = () => {
  const [form, setForm] = useState<AssignmentForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();

  const update = <K extends keyof AssignmentForm>(
    key: K,
    value: AssignmentForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => {
      const nextErrors = { ...prev };

      if (key === "subjectId") {
        delete nextErrors.subject;
      } else if (key === "title") {
        delete nextErrors.title;
      } else if (key === "priority") {
        delete nextErrors.priority;
      }

      return nextErrors;
    });
  };

  const handleSave = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      Alert.alert(
        "Missing fields",
        "Please fill the title, subject, and priority.",
      );
      return;
    }

    if (form.subjectId == null) {
      setErrors((prev) => ({ ...prev, subject: "Required" }));
      Alert.alert("Missing subject", "Please select a subject.");
      return;
    }

    try {
      const insertedId = createAssignment({
        title: form.title.trim(),
        subjectId: form.subjectId,
        dueDate: form.dueDate.toISOString(),
        priority: form.priority,
        attachmentUri: form.attachment?.uri,
        attachmentName: form.attachment?.name,
        attachmentMimeType: form.attachment?.mimeType,
        completed: false,
      });

      if (insertedId) {
        setForm(INITIAL_FORM);
        setErrors({});
        Alert.alert("Saved", "Assignment added successfully.");

        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(tabs)/assignment");
        }
      }
    } catch (error) {
      console.log("Something went wrong while saving assignment", error);
      Alert.alert("Save failed", "Please try again.");
    }
  };

  const handleAttach = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    update("attachment", {
      name: file.name,
      uri: file.uri,
      size: file.size,
      mimeType: file.mimeType,
    });
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        <Header />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View>
            <FieldLabel label="Assignment Title" error={errors.title} />
            <TextInput
              value={form.title}
              onChangeText={(t) => update("title", t)}
              placeholder="Enter Title"
              placeholderTextColor="#6b7280"
              className="bg-surface rounded-2xl px-4 py-3 text-text"
            />
          </View>

          {/* Subject */}
          <View>
            <FieldLabel label="Subject" error={errors.subject} />
            <DropdownComponent
              value={form.subjectId}
              onChange={(value) => update("subjectId", value)}
            />
          </View>

          {/* Due Date */}
          <View>
            <FieldLabel label="Due Date" />
            <DatePicker
              date={form.dueDate}
              setDate={(d) => update("dueDate", d)}
            />
          </View>

          {/* Priority */}
          <View>
            <FieldLabel label="Priority" error={errors.priority} />
            <PrioritySelector
              value={form.priority}
              onChange={(p) => update("priority", p)}
            />
          </View>

          {/* Document */}
          <View>
            <FieldLabel label="Document" />
            <DocumentCard
              attachment={form.attachment}
              onAttach={handleAttach}
              onRemove={() => update("attachment", null)}
            />
          </View>
        </ScrollView>

        {/* Sticky Save */}
        <View className="px-4 py-3 border-t border-surface">
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.85}
            style={{
              backgroundColor: "#2563EB",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text className="text-white font-semibold text-base">
              Save Assignment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateAssignment;
