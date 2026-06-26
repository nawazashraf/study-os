import { useRouter } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect } from "react";

export default function ShareHandler() {
  const router = useRouter();

  const { hasShareIntent, shareIntent, resetShareIntent } =
    useShareIntentContext();

  useEffect(() => {
    if (!hasShareIntent) return;

    const file = shareIntent.files?.[0];

    if (!file) return;

    router.replace({
      pathname: "/(tabs)/assignment/create",
      params: {
        fileUri: file.path,
        fileName: file.fileName,
        mimeType: file.mimeType,
      },
    });

    resetShareIntent();
  }, [hasShareIntent]);

  return null;
}
