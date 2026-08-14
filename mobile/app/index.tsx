import { View, Text, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import Animated, {
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";
import CalmButton from "../components/CalmButton";
import Logo from "../components/Logo";
import NomiOnboarding from "../assets/images/nomi-onboarding.svg";

const SCREEN_WIDTH = Math.min(Dimensions.get("window").width, 430);

export default function OnboardingScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <View className="flex-1">
        <View className="items-center px-6 pt-12">
          <Logo variant="pink" size={89} />

          <View className="mt-6 w-full max-w-[305px]">
            <Text className="font-jakarta-bold text-[32px] leading-[38px] text-black text-center">
              Pulih Pelan-Pelan{"\n"}Sesuai Ritmemu
            </Text>
            <Text className="font-rubik-regular text-sm text-black text-center mt-2 leading-[21px]">
              Tidak ada batasan waktu. Nomi siap mendampingi setiap langkah kecilmu hari ini.
            </Text>
          </View>

          <View className="mt-10">
            <CalmButton
              title="Yuk Mulai"
              onPress={() => router.push("/calm")}
              variant="pink"
              icon={
                <Ionicons name="arrow-forward" size={20} color="white" />
              }
            />
          </View>
        </View>

        <View className="flex-1 justify-end">
          <View className="w-full items-center overflow-hidden">
            <NomiOnboarding
              width={SCREEN_WIDTH}
              height={SCREEN_WIDTH * (387 / 430)}
              style={{ transform: [{ scale: 1.02 }] }} // Menghilangkan celah subpixel
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
