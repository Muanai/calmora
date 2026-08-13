import { View, Text, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CalmButton from "../components/CalmButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CalmScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full overflow-hidden" style={{ height: 280 }}>
          <View
            className="bg-purple items-center justify-end pb-4"
            style={{
              width: SCREEN_WIDTH * 1.7,
              height: 500,
              borderBottomLeftRadius: SCREEN_WIDTH,
              borderBottomRightRadius: SCREEN_WIDTH,
              alignSelf: "center",
              marginTop: -220,
            }}
          >
            <View className="flex-row gap-6 mb-2">
              <View className="w-[135px] h-[175px] bg-white rounded-full items-center justify-center">
                <View className="w-[75px] h-[75px] bg-black rounded-full" />
              </View>
              <View className="w-[135px] h-[175px] bg-white rounded-full items-center justify-center">
                <View className="w-[75px] h-[75px] bg-black rounded-full ml-3" />
              </View>
            </View>

            <View className="flex-row gap-2 mt-1">
              <View className="w-3 h-3 bg-white/30 rounded-full" />
              <View className="w-3 h-3 bg-white/60 rounded-full" />
            </View>
          </View>
        </View>

        <View className="px-6 mt-4">
          <View className="bg-purple rounded-btn flex-row items-center p-4 gap-4">
            <View className="w-[60px] h-[60px] bg-white/20 rounded-btn items-center justify-center">
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

          <View className="bg-white rounded-card mt-4 p-8 items-center shadow-lg" style={{
            shadowColor: "#131927",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text className="font-jakarta-bold text-xl text-black text-center">
              Penenang Cepat
            </Text>
            <Text className="font-rubik-regular text-sm text-black text-center mt-1">
              Ikuti ritme nafas ini untuk meredakan panik
            </Text>

            <View className="mt-8 mb-8 items-center justify-center">
              <View className="w-[165px] h-[165px] rounded-full bg-purple-lighter items-center justify-center">
                <View className="w-[120px] h-[120px] rounded-full bg-purple-light items-center justify-center">
                  <MaterialCommunityIcons name="weather-windy" size={48} color="#806DE3" />
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
