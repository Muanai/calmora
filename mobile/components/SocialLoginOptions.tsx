import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

// Required for web to complete auth session
WebBrowser.maybeCompleteAuthSession();

interface SocialLoginOptionsProps {
  onLoginPress?: () => void;
  isLogin?: boolean;
  onLoadingChange?: (isLoading: boolean) => void;
}

export default function SocialLoginOptions({
  onLoginPress,
  isLogin = false,
  onLoadingChange,
}: SocialLoginOptionsProps) {
  const router = useRouter();
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: "oauth_apple" });
  const { startOAuthFlow: startFacebookFlow } = useOAuth({ strategy: "oauth_facebook" });

  const [loadingProvider, setLoadingProvider] = React.useState<"google" | "apple" | "facebook" | null>(null);

  const handleOAuthPress = useCallback(async (strategy: "google" | "apple" | "facebook") => {
    if (loadingProvider) return;
    setLoadingProvider(strategy);
    if (onLoadingChange) onLoadingChange(true);

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
          // Note: the auth guard in the screen will handle the redirect to complete-profile or dashboard
        }
      }
    } catch (err) {
      console.error(`OAuth error (${strategy}):`, err);
    } finally {
      setLoadingProvider(null);
      if (onLoadingChange) onLoadingChange(false);
    }
  }, [startGoogleFlow, startAppleFlow, startFacebookFlow, loadingProvider, onLoadingChange]);

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
          className={`flex-1 h-[48px] rounded-btn items-center justify-center ${loadingProvider ? 'bg-grey-light' : 'bg-pink-light'}`}
          activeOpacity={0.7}
          onPress={() => handleOAuthPress("google")}
          disabled={!!loadingProvider}
        >
          {loadingProvider === "google" ? (
            <ActivityIndicator color="#DB4437" />
          ) : (
            <Ionicons name="logo-google" size={24} color={loadingProvider ? "#999" : "#DB4437"} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 h-[48px] rounded-btn items-center justify-center ${loadingProvider ? 'bg-grey-light' : 'bg-pink-light'}`}
          activeOpacity={0.7}
          onPress={() => handleOAuthPress("apple")}
          disabled={!!loadingProvider}
        >
          {loadingProvider === "apple" ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Ionicons name="logo-apple" size={24} color={loadingProvider ? "#999" : "#000"} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 h-[48px] rounded-btn items-center justify-center ${loadingProvider ? 'bg-grey-light' : 'bg-pink-light'}`}
          activeOpacity={0.7}
          onPress={() => handleOAuthPress("facebook")}
          disabled={!!loadingProvider}
        >
          {loadingProvider === "facebook" ? (
            <ActivityIndicator color="#1877F2" />
          ) : (
            <Ionicons name="logo-facebook" size={24} color={loadingProvider ? "#999" : "#1877F2"} />
          )}
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
