import DatePicker from "@/components/assignment/DatePicker";
import DocumentCard from "@/components/assignment/DocumentCard";
import DropdownComponent from "@/components/assignment/DropDownComponent";
import FieldLabel from "@/components/assignment/FieldLabel";
import { Header } from "@/components/assignment/Header";
import PrioritySelector from "@/components/assignment/PrioritySelector";
import { createAssignment } from "@/database/assignmentService";
import { AssignmentForm, FormErrors } from "@/types/assignment";
import { validate } from "@/utils/assignmentValidation";
import { cleanFileName } from "@/utils/cleanFileName";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreateAssignment = () => {
  // const { fileUri, fileName, mimeType } = useLocalSearchParams();
  const { shareIntent, resetShareIntent } = useShareIntentContext();
  const sharedFile = shareIntent?.files?.[0];

  const { fileUri, fileName, mimeType } = useLocalSearchParams();

  const importedFromShare = !!sharedFile || !!fileUri;

  const [form, setForm] = useState<AssignmentForm>({
    title: "",
    subjectId: null,
    dueDate: new Date(),
    priority: "",
    attachment: null,
  });

  useEffect(() => {
    if (!sharedFile) return;

    setForm((prev) => {
      if (prev.attachment) return prev;

      return {
        ...prev,
        title: cleanFileName(sharedFile.fileName),
        attachment: {
          uri: sharedFile.path,
          name: sharedFile.fileName,
          mimeType: sharedFile.mimeType,
        },
      };
    });
  }, [sharedFile]);

  // If ShareHandler navigated with params, use them as a fallback
  useEffect(() => {
    if (!fileUri || !fileName) return;

    setForm((prev) => {
      if (prev.attachment) return prev;

      return {
        ...prev,
        title: cleanFileName(String(fileName)),
        attachment: {
          uri: String(fileUri),
          name: String(fileName),
          mimeType: String(mimeType) || undefined,
        },
      };
    });
  }, [fileUri, fileName, mimeType]);

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
        setForm({
          title: "",
          subjectId: null,
          dueDate: new Date(),
          priority: "",
          attachment: null,
        });

        // resetShareIntent?.();
        setErrors({});
        Alert.alert("Saved", "Assignment added successfully.");

        if (router.canGoBack && router.canGoBack()) {
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

    // Handle different result shapes across SDK versions
    // - new shape: { canceled: boolean, assets: [...] }
    // - legacy shape: { type: 'success'|'cancel', name, uri, size, mimeType }
    const anyResult = result as any;

    if (("canceled" in anyResult && anyResult.canceled) || (anyResult.type === "cancel")) {
      return;
    }

    const file = anyResult.assets?.[0] ?? anyResult;
    if (!file) return;

    update("attachment", {
      name: file.name ?? file.fileName,
      uri: file.uri ?? file.uri,
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

          <View>
            <FieldLabel label="Document" />

            {importedFromShare && (
              <View className="mb-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4">
                <Text className="font-semibold text-green-500">
                  ✓ Imported from another app
                </Text>

                <Text className="mt-1 text-sm text-muted">
                  The attachment has already been added.
                </Text>
              </View>
            )}

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
