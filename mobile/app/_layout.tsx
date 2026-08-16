import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Rubik_400Regular } from "@expo-google-fonts/rubik";
import { View, ActivityIndicator, Platform } from "react-native";

import * as SecureStore from "expo-secure-store";
import { ClerkProvider } from "@clerk/clerk-expo";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    Rubik_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFDF0" }}>
        <ActivityIndicator size="large" color="#D7385E" />
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey || "pk_test_placeholder"} tokenCache={tokenCache}>
      <View style={Platform.OS === "web" ? { flex: 1, maxWidth: 430, width: "100%", alignSelf: "center", backgroundColor: "#FFFDF0", overflow: "hidden" } : { flex: 1 }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="calm" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        </Stack>
      </View>
    </ClerkProvider>
  );
}
