import { View, Text, Image, TouchableOpacity } from "react-native";

const mascotLyingImg = require("../../assets/images/mascot-lie-down.png");

export default function DailyBanner() {
  return (
    <View className="px-6 py-2">
      <TouchableOpacity
        className="w-full bg-[#61ADC0] rounded-[20px] h-[150px] flex-row items-center justify-between px-5 relative overflow-hidden"
        activeOpacity={0.9}
      >
        <View className="flex-1 pr-2 z-10 justify-center py-4">
          <Text className="font-jakarta-bold text-[15px] text-white mb-2 flex-wrap" numberOfLines={2}>
            Langkah Kecil Itu Nyata
          </Text>
          <Text className="font-jakarta-regular text-[11px] text-white leading-4 flex-wrap" numberOfLines={3}>
            Tidak perlu buru-buru. Setiap gerak kecilmu sangat berarti.
          </Text>
        </View>
        <View className="w-[120px] h-full z-10 items-center justify-center">
          <Image
            source={mascotLyingImg}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        </View>

        {/* Decorative background shapes mimicking Figma's layered look behind the banner */}
        <View className="absolute top-[-20px] left-[-20px] w-[150px] h-[150px] bg-white opacity-10 rounded-full" />
        <View className="absolute bottom-[-50px] right-[-20px] w-[200px] h-[200px] bg-white opacity-10 rounded-full" />
      </TouchableOpacity>
    </View>
  );
}
