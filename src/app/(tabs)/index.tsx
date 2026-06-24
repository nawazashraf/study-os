import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
      }}
      className="bg-background"
    >
      <View className="bg-background flex flex-1">
        <Text>Hii N</Text>
      </View>
    </SafeAreaView>
  );
}
