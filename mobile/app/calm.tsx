import { View, Text, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useState, useRef, useCallback } from "react";
import Animated, {
  FadeInDown,
  FadeOutDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation
} from "react-native-reanimated";
import CalmButton from "../components/CalmButton";
import NomiCalm from "../assets/images/nomi-calm.svg";
import PlayIcon from "../assets/images/play.svg";
import StopIcon from "../assets/images/stop.svg";
import WindIcon from "../assets/images/wind.svg";

const SCREEN_WIDTH = Math.min(Dimensions.get("window").width, 430);

export default function CalmScreen() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Siap?");
  
  const scale = useSharedValue(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runPhase = useCallback((currentPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2') => {
    if (currentPhase === 'inhale') {
      setPhase("Tarik Nafas....");
      scale.value = withTiming(1.25, { duration: 4000, easing: Easing.inOut(Easing.ease) });
      timeoutRef.current = setTimeout(() => runPhase('hold1'), 4000);
    } else if (currentPhase === 'hold1') {
      setPhase("Tahan...");
      timeoutRef.current = setTimeout(() => runPhase('exhale'), 4000); // 4 detik tahan
    } else if (currentPhase === 'exhale') {
      setPhase("Hembuskan...");
      scale.value = withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) });
      timeoutRef.current = setTimeout(() => runPhase('hold2'), 4000);
    } else if (currentPhase === 'hold2') {
      setPhase("Tahan...");
      timeoutRef.current = setTimeout(() => runPhase('inhale'), 4000); // 4 detik tahan sebelum tarik lagi
    }
  }, [scale]);

  const toggleBreathing = () => {
    if (isActive) {
      // Stop
      setIsActive(false);
      setPhase("Siap?");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 1000 });
    } else {
      // Start
      setIsActive(true);
      setPhase("Bersiap...");
      timeoutRef.current = setTimeout(() => runPhase('inhale'), 1500);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      cancelAnimation(scale);
    };
  }, []);



  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

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
            >
              <View style={{ transform: [{ scale: 1.02 }] }}>
                <NomiCalm
                  width={SCREEN_WIDTH * 0.8}
                  height={SCREEN_WIDTH * 0.65}
                />
              </View>
            </Animated.View>
          </View>
        </View>

        <View className="px-6 mt-4">
          <View className="bg-purple rounded-btn flex-row items-center py-[14px] pl-4 pr-3 gap-3">
            <View
              className="w-[60px] h-[60px] rounded-btn items-center justify-center overflow-hidden"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <WindIcon width={48} height={48} color="white" />
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

            <View className="mt-8 mb-6 items-center justify-center">
              <Animated.View style={animatedStyle}>
                <View className="w-[165px] h-[165px] rounded-full bg-[#806DE3]/15 items-center justify-center">
                  <View className="w-[130px] h-[130px] rounded-full bg-[#806DE3]/40 items-center justify-center">
                    <View className="w-[95px] h-[95px] rounded-full bg-[#806DE3] items-center justify-center">
                      <WindIcon width={60} height={60} color="white" />
                    </View>
                  </View>
                </View>
              </Animated.View>
            </View>

            <View style={{ height: 24, justifyContent: 'center', marginBottom: 16 }}>
              {isActive && (
                <Text className="font-jakarta-regular text-sm text-[#806DE3] text-center">
                  {phase}
                </Text>
              )}
            </View>

            <CalmButton
              title={isActive ? "Hentikan" : "Atur Nafas"}
              onPress={toggleBreathing}
              variant="purple"
              icon={
                isActive ? <StopIcon width={24} height={24} /> : <PlayIcon width={24} height={24} />
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
