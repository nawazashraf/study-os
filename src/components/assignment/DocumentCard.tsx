import { AttachedDoc } from "@/types/assignment";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const formatBytes = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface Props {
  attachment: AttachedDoc | null;
  onAttach: () => void;
  onRemove: () => void;
}

const DocumentCard = ({ attachment, onAttach, onRemove }: Props) => {
  const extension = attachment?.name.split(".").pop()?.toUpperCase();
  if (attachment) {
    return (
      <View className="bg-surface rounded-2xl px-4 py-3 flex-row items-center gap-x-3">
        <View className="w-10 h-10 bg-primary/20 rounded-xl items-center justify-center">
          <Text className="font-bold text-primary">{extension}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-text text-sm font-medium" numberOfLines={1}>
            {attachment.name}
          </Text>
          {attachment.size !== undefined && (
            <Text className="text-muted text-xs mt-0.5">
              {formatBytes(attachment.size)}
            </Text>
          )}
        </View>
        <Pressable
          onPress={onRemove}
          className="px-3 py-1 rounded-xl bg-red-500/15"
        >
          <Text className="text-red-400 text-xs font-medium">Remove</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onAttach}
      className="bg-surface rounded-2xl py-5 items-center gap-y-1 border border-dashed border-muted/40"
    >
      <Ionicons name="document-attach-outline" size={30} color="#6366F1" />
      <Text className="text-text text-sm font-medium mt-1">Attach PDF</Text>
      <Text className="text-muted text-xs">Tap to browse</Text>
    </Pressable>
  );
};

export default DocumentCard;
