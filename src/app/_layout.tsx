import ShareHandler from "@/components/share/ShareHandler";
import CustomSplash from "@/components/SplashScreen";
import { initDB } from "@/database/init";
import { Stack } from "expo-router";
import { ShareIntentProvider } from "expo-share-intent";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

void SplashScreen.preventAutoHideAsync();

const MIN_SPLASH_MS = 1200;

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.error("Failed to hide native splash screen", e);
      }

      try {
        const start = Date.now();

        initDB();

        // const elapsed = Date.now() - start;
        // const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
        // if (remaining > 0) {
        //   await new Promise((resolve) => setTimeout(resolve, remaining));
        // }

        await new Promise((resolve) => setTimeout(resolve, 2000));

        setDbReady(true);
      } catch (e) {
        console.error("Failed to initialize database", e);
        // Still let the splash finish so the app doesn't get stuck forever
        // on an init error — surface the failure elsewhere once mounted.
        setDbReady(true);
      }
    }

    prepare();
  }, []);

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
        </Stack>
        {!splashDone && (
          <CustomSplash ready={dbReady} onFinish={() => setSplashDone(true)} />
        )}
      </ShareIntentProvider>
    </GestureHandlerRootView>
  );
}
