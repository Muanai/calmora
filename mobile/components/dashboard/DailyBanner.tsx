import { View, Text, Image, TouchableOpacity } from "react-native";

const mascotLyingImg = require("../../assets/images/mascot-lie-down.png");

export default function DailyBanner() {
  return (
    <View className="px-6 py-2 mb-4 items-center">
      <View className="w-full relative items-center">
        {/* Layer 3 (Bottom-most bubble) */}
        <View className="absolute bg-[#E7F3F6] h-[125px] w-[88%] rounded-[20px] top-[45px] z-0" />
        
        {/* Layer 2 (Middle bubble) */}
        <View className="absolute bg-[#CEE6EB] h-[140px] w-[94%] rounded-[20px] top-[22px] z-10" />

        {/* Main Banner (Top) */}
        <TouchableOpacity
          className="w-full bg-[#61ADC0] rounded-[20px] h-[150px] flex-row items-center justify-between px-5 relative z-20"
          activeOpacity={0.9}
        >
          <View className="flex-[1.2] pr-2 z-10 justify-center py-4">
            <Text className="font-jakarta-bold text-[18px] text-white mb-2 flex-wrap" numberOfLines={2}>
              Langkah Kecil Itu Nyata
            </Text>
            <Text className="font-jakarta-regular text-[12px] text-white leading-[18px] flex-wrap" numberOfLines={3}>
              Tidak perlu buru-buru. Setiap gerak kecilmu sangat berarti.
            </Text>
          </View>
          <View className="w-[110px] h-full z-10 items-center justify-center">
            <Image
              source={mascotLyingImg}
              style={{ width: 110, height: 110 }}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        {/* Spacer to give room for the layers sticking out at the bottom */}
        <View className="h-[25px]" />
      </View>
    </View>
  );
}
