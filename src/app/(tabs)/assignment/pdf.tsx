import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

export default function PdfScreen() {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPdf = async () => {
    if (!uri) return;

    try {
      setOpening(true);
      let openUri = uri;

      if (Platform.OS === "android" && uri.startsWith("file://")) {
        const contentUri = await FileSystem.getContentUriAsync(uri);
        if (contentUri) {
          openUri = contentUri;
        }
      }

      const supported = await Linking.canOpenURL(openUri);
      if (!supported) {
        throw new Error("This device cannot open the provided document URI.");
      }

      await Linking.openURL(openUri);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      Alert.alert("Unable to open PDF", message);
    } finally {
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
