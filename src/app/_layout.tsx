import ShareHandler from "@/components/share/ShareHandler";
import { initDB } from "@/database/init";
import { Stack } from "expo-router";
import { ShareIntentProvider } from "expo-share-intent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

initDB();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ShareIntentProvider>
        <ShareHandler />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: {
              backgroundColor: "#252525",
            },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="activity" />
          {/* <Stack.Screen name="syllabus" /> */}
        </Stack>
      </ShareIntentProvider>
    </GestureHandlerRootView>
  );
}
