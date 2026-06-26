import { Text, View } from "react-native";

interface Props {
  label: string;
  error?: string;
}

const FieldLabel = ({ label, error }: Props) => (
  <View className="flex-row items-center justify-between mb-2">
    <Text className="text-text text-base font-medium">{label}</Text>
    {error && <Text className="text-red-400 text-xs">{error}</Text>}
  </View>
);

export default FieldLabel;
