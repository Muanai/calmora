import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

// Required for web to complete auth session
WebBrowser.maybeCompleteAuthSession();

interface SocialLoginOptionsProps {
  onLoginPress?: () => void;
  isLogin?: boolean;
}

export default function SocialLoginOptions({
  onLoginPress,
  isLogin = false,
}: SocialLoginOptionsProps) {
  const router = useRouter();
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: startFacebookFlow } = useOAuth({ strategy: "oauth_facebook" });

  const handleOAuthPress = useCallback(async (strategy: "google" | "apple" | "facebook") => {
    try {
      let flow;
      if (strategy === "google") flow = startGoogleFlow;
      else if (strategy === "apple") flow = startAppleFlow;
      else if (strategy === "facebook") flow = startFacebookFlow;

      if (flow) {
        const { createdSessionId, setActive } = await flow({
          redirectUrl: Platform.OS === 'web' ? window.location.href : undefined,
        });
        
        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
          router.replace("/dashboard");
        }
      }
    } catch (err) {
      console.error(`OAuth error (${strategy}):`, err);
    }
  }, [startGoogleFlow, startAppleFlow, startFacebookFlow, router]);

  return (
    <View className="mt-6 gap-6 items-center">
      <View className="flex-row items-center w-full gap-3">
        <View className="flex-1 h-[1px] bg-grey" />
        <Text className="font-rubik-regular text-sm text-grey">
          Atau masuk menggunakan
        </Text>
        <View className="flex-1 h-[1px] bg-grey" />
      </View>

      <View className="flex-row items-center justify-between w-full gap-4">
        <TouchableOpacity
          className="flex-1 h-[48px] bg-pink-light rounded-btn items-center justify-center"
          activeOpacity={0.7}
          onPress={() => handleOAuthPress("google")}
        >
          <Ionicons name="logo-google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-[48px] bg-pink-light rounded-btn items-center justify-center"
          activeOpacity={0.7}
          onPress={() => handleOAuthPress("apple")}
        >
          <Ionicons name="logo-apple" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-[48px] bg-pink-light rounded-btn items-center justify-center"
          activeOpacity={0.7}
          onPress={() => handleOAuthPress("facebook")}
        >
          <Ionicons name="logo-facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center">
        <Text className="font-rubik-regular text-sm text-grey">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        </Text>
        <TouchableOpacity onPress={onLoginPress}>
          <Text className="font-rubik-regular text-sm text-link underline">
            {isLogin ? "Daftar" : "Masuk"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
