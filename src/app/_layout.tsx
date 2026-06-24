import { initDB } from "@/database/init";
import { Stack } from "expo-router";
import "../global.css";

initDB();

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="note-edit" />
    </Stack>
  );
}
