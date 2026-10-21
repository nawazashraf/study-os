import * as SecureStore from "expo-secure-store";

const USER_NAME_KEY = "userName";

export const getUserName = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(USER_NAME_KEY);
  } catch {
    return null;
  }
};

export const setUserName = async (name: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(USER_NAME_KEY, name);
  } catch {
    // ignore write failures for now
  }
};
