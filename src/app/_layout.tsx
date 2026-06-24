import { initDB } from "@/database/init";
import { Stack } from "expo-router";
import "../global.css";

initDB();

export default function RootLayout() {
  return (
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
    </Stack>
  );
}
