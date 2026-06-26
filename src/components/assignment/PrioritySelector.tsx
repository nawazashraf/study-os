import { STYLES } from "@/data/priorityColor";
import { Priority } from "@/types/assignment";
import { Pressable, Text, View } from "react-native";

const LEVELS = ["Low", "Medium", "High"] as const;

interface Props {
  value: Priority;
  onChange: (p: Priority) => void;
}

const PrioritySelector = ({ value, onChange }: Props) => (
  <View className="flex-row gap-x-2">
    {LEVELS.map((level) => {
      const active = value === level;
      return (
        <Pressable
          key={level}
          onPress={() => onChange(level)}
          className={`flex-1 items-center py-2 rounded-2xl ${
            active ? STYLES[level].bg : "bg-surface"
          }`}
        >
          <Text
            className={`text-sm font-medium ${active ? STYLES[level].text : "text-muted"}`}
          >
            {level}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export default PrioritySelector;
