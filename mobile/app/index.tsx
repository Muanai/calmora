import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CalmButton from "../components/CalmButton";
import Logo from "../components/Logo";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center px-6 pt-12">
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

        <View className="w-full mt-auto">
          <View
            className="w-full overflow-hidden items-center justify-center"
            style={{ height: SCREEN_WIDTH * 0.75 }}
          >
            <View
              className="bg-pink rounded-t-[999px] items-center pt-8"
              style={{
                width: SCREEN_WIDTH * 1.7,
                height: SCREEN_WIDTH * 1.3,
                borderTopLeftRadius: SCREEN_WIDTH,
                borderTopRightRadius: SCREEN_WIDTH,
              }}
            >
              <View className="flex-row gap-7 mt-8">
                <View className="w-[135px] h-[175px] bg-white rounded-full items-center justify-center">
                  <View className="w-[80px] h-[80px] bg-black rounded-full" />
                </View>
                <View className="w-[135px] h-[175px] bg-white rounded-full items-center justify-center">
                  <View className="w-[80px] h-[80px] bg-black rounded-full ml-4" />
                </View>
              </View>

              <View className="flex-row gap-2 mt-4">
                <View className="w-3 h-3 bg-black/30 rounded-full" />
                <View className="w-3 h-3 bg-black/60 rounded-full" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
