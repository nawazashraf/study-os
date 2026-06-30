import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  actionText?: string;
  onPressAction?: () => void;
};

export default function SectionHeader({
  title,
  subtitle,
  actionText,
  onPressAction,
}: Props) {
  return (
    <View className="mb-4 flex-row items-end justify-between">
      <View className="flex-1">
        <Text className="text-2xl font-bold text-text">{title}</Text>

        {subtitle ? (
          <Text className="mt-1 text-sm text-text-secondary">{subtitle}</Text>
        ) : null}
      </View>

      {actionText && (
        <Pressable onPress={onPressAction} className="rounded-xl px-2 py-1">
          <Text className="font-medium text-primary">{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
}
