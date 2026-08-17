import { View, Text, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import Animated, {
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import CalmButton from "../components/CalmButton";
import NomiCalm from "../assets/images/nomi-calm.svg";

const SCREEN_WIDTH = Math.min(Dimensions.get("window").width, 430);

export default function CalmScreen() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();

  useEffect(() => {
    if (userLoaded && user) {
      if (user.unsafeMetadata?.kondisi) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/complete-profile");
      }
    }
  }, [userLoaded, user]);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full overflow-hidden items-center"
          style={{ height: SCREEN_WIDTH * 0.75 }}
        >
          <View
            className="bg-purple items-center justify-end pb-4"
            style={{
              width: SCREEN_WIDTH * 1.7,
              height: SCREEN_WIDTH * 1.5,
              borderBottomLeftRadius: SCREEN_WIDTH,
              borderBottomRightRadius: SCREEN_WIDTH,
              alignSelf: "center",
              marginTop: -(SCREEN_WIDTH * 0.75),
            }}
          >
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={{ transform: [{ scale: 1.02 }] }} // Menghilangkan celah subpixel
            >
              <NomiCalm
                width={SCREEN_WIDTH * 0.8}
                height={SCREEN_WIDTH * 0.65}
              />
            </Animated.View>
          </View>
        </View>

        <View className="px-6 mt-4">
          <View className="bg-purple rounded-btn flex-row items-center py-[14px] pl-4 pr-3 gap-3">
            <View
              className="w-[60px] h-[60px] rounded-btn items-center justify-center overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <MaterialCommunityIcons name="weather-windy" size={32} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-jakarta-bold text-xl text-white leading-6">
                Penenang Cepat
              </Text>
              <Text className="font-jakarta-regular text-xs text-white mt-1">
                Atur nafas untuk meredakan panik sekarang
              </Text>
            </View>
          </View>

          <View
            className="bg-white rounded-card mt-4 py-8 px-6 items-center"
            style={{
              shadowColor: "#131927",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text className="font-jakarta-bold text-xl text-black text-center">
              Penenang Cepat
            </Text>
            <Text className="font-rubik-regular text-sm text-black text-center mt-1">
              Ikuti ritme nafas ini untuk meredakan panik
            </Text>

            <View className="mt-10 mb-10 items-center justify-center">
              <View className="w-[165px] h-[165px] rounded-full bg-purple-lighter items-center justify-center">
                <View className="w-[130px] h-[130px] rounded-full bg-purple-light items-center justify-center">
                  <View className="w-[95px] h-[95px] rounded-full bg-purple/20 items-center justify-center">
                    <MaterialCommunityIcons name="weather-windy" size={40} color="#806DE3" />
                  </View>
                </View>
              </View>
            </View>

            <CalmButton
              title="Atur Nafas"
              onPress={() => {}}
              variant="purple"
              icon={
                <Ionicons name="play" size={18} color="white" />
              }
            />
          </View>

          <View className="mt-6 mb-8">
            <CalmButton
              title="Mau Akses Fitur Lainnya?"
              onPress={() => router.push("/(auth)/sign-in")}
              variant="outline-purple"
              fullWidth
              icon={
                <Ionicons name="arrow-forward" size={20} color="#806DE3" />
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
