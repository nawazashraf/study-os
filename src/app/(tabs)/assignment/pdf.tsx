import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";

export default function PdfScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const intentPendingRef = useRef(false);

  const openPdf = async () => {
    if (intentPendingRef.current) return;
    intentPendingRef.current = true;
    if (!uri) return;

    let original = String(uri);
    try {
      setOpening(true);
      original = String(uri);
      let openUri = original;

      // Normalize plain file paths (e.g. /data/...) to file:// scheme
      let contentUri: string | null = null;
      if (Platform.OS === "android") {
        if (!openUri.startsWith("file://") && !openUri.startsWith("content://")) {
          openUri = `file://${openUri}`;
        }

        // Convert file:// URIs to content:// URIs which are safe to share with other apps
        if (openUri.startsWith("file://")) {
          try {
            contentUri = await FileSystem.getContentUriAsync(openUri);
            if (contentUri) openUri = contentUri;
          } catch (e) {
            // getContentUriAsync may fail on some devices; fall back to file:// URI
            contentUri = null;
          }
        }
      }

      const encoded = encodeURI(openUri);
      const canOpenEncoded = await Linking.canOpenURL(encoded).catch(() => false);
      const canOpenRaw = await Linking.canOpenURL(openUri).catch(() => false);

      // Save debug info
      setDebugInfo({ original, openUri, contentUri, canOpenEncoded, canOpenRaw });

      // On Android, use a direct intent with read permission flags for private content URIs.
      if (Platform.OS === "android") {
        try {
          const intentParams = {
            data: openUri,
            type: "application/pdf",
            flags: 1 | 268435456, // FLAG_GRANT_READ_URI_PERMISSION | FLAG_ACTIVITY_NEW_TASK
          };
          await IntentLauncher.startActivityAsync("android.intent.action.VIEW", intentParams);
          return;
        } catch (intentErr) {
          console.warn("Intent launch failed:", intentErr);
        }
      }

      if (!canOpenEncoded && !canOpenRaw) {
        // Try opening directly even if canOpenURL said false (some providers don't advertise support)
        await Linking.openURL(openUri);
        return;
      }

      await Linking.openURL(canOpenEncoded ? encoded : openUri);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      Alert.alert("Unable to open PDF", message);

      // Fallback: try share sheet so user can open with another app
      try {
        const available = await Sharing.isAvailableAsync();
        if (available) {
          await Sharing.shareAsync(original);
        }
      } catch (shareErr) {
        // ignore
      }
    } finally {
      intentPendingRef.current = false;
      setOpening(false);
    }
  };

  useEffect(() => {
    if (uri) {
      openPdf();
    }
  }, [uri]);

  if (!uri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Unable to open PDF. No document URI was provided.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.messageContainer}>
        {opening ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.messageText}>Opening PDF…</Text>
          </View>
        ) : (
          <>
            <Text style={styles.messageText}>If your PDF did not open automatically, tap below.</Text>
            <Pressable style={styles.button} onPress={openPdf}>
              <Text style={styles.buttonText}>Open PDF</Text>
            </Pressable>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {Object.keys(debugInfo).length > 0 && (
              <View style={{ marginTop: 20, alignItems: "flex-start" }}>
                <Text style={{ color: "#fff", marginBottom: 8 }}>Debug info:</Text>
                <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                  {JSON.stringify(debugInfo, null, 2)}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  statusContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  messageText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#2563EB",
    borderRadius: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    marginTop: 16,
    color: "#F87171",
    textAlign: "center",
  },
});
