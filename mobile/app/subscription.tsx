import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import SubscriptionIcon from "../assets/images/subscription.svg";
import RobotIcon from "../assets/images/robot.svg";
import FeatureStarIcon from "../assets/images/feature-star.svg";
import MissionIcon from "../assets/images/mission.svg";
import MeditationIcon from "../assets/images/meditation.svg";
import SupporterBadgeIcon from "../assets/images/supporter-badge.svg";

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#FFFDF0]">
      {/* Header */}
      <View
        className="flex-row items-center px-6 bg-[#FFFDF0] z-10"
        style={{ paddingTop: insets.top + 16, paddingBottom: 16 }}
      >
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center mr-2"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <View className="items-center justify-center mr-3 bg-[#357BF7] w-[40px] h-[40px] rounded-[10px]">
          <SubscriptionIcon width={24} height={24} />
        </View>

        <Text className="font-jakarta-bold text-[20px] text-black flex-1">Langganan</Text>
      </View>

      {/* Divider */}
      <View className="mx-6 h-[1px] bg-[#E5E5E5]" />

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <View className="mb-6">
          <Text className="font-jakarta-bold text-[20px] text-black mb-2">
            Rawat Ruang Tenangmu Lebih Dalam
          </Text>
          <Text className="font-jakarta-regular text-[14px] text-black">
            Investasi kecil untuk pikiran yang lebih jernih. Dapatkan pendampingan Nomi yang lebih personal tanpa tekanan.
          </Text>
        </View>

        {/* Teman Cerita Card */}
        <View className="bg-[#FBEBEF] border-2 border-[#D7385E] rounded-[16px] p-6 mb-6">
          <Text className="font-jakarta-bold text-[20px] text-black mb-3">Teman Cerita</Text>
          <View className="flex-row items-end mb-4">
            <Text className="font-jakarta-bold text-[#D7385E] text-[24px] leading-tight">Rp 29.000</Text>
            <Text className="font-jakarta-regular text-[#D7385E] text-[24px] leading-tight">/bln</Text>
          </View>

          <TouchableOpacity
            className="w-full h-[48px] bg-[#D7385E] rounded-[16px] items-center justify-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="font-jakarta-semibold text-[16px] text-white">Dapatkan Paket Teman Cerita</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-2">
            <Image source={require('../assets/logo-pink.png')} style={{ width: 30, height: 30 }} resizeMode="contain" />
            <Text className="font-jakarta-semibold text-[16px] text-black ml-3">Calmora</Text>
          </View>

          <View className="flex-row items-start mb-4">
            <Ionicons name="checkmark" size={20} color="black" style={{ marginTop: 2 }} />
            <Text className="font-jakarta-regular text-[14px] text-black ml-3 flex-1 leading-tight">
              Ruang cerita lebih personal dengan AI yang siap mengingatmu
            </Text>
          </View>

          <View className="w-full h-[1px] bg-[#D7385E] opacity-20 mb-4" />

          {/* Features */}
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-lg bg-[#D7385E] items-center justify-center mr-4">
              <FeatureStarIcon width={16} height={16} />
            </View>
            <Text className="font-jakarta-regular text-[14px] text-black flex-1">Semua fitur free</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-lg bg-[#D7385E] items-center justify-center mr-4">
              <RobotIcon width={26} height={26} />
            </View>
            <Text className="font-jakarta-regular text-[14px] text-black flex-1">AI S.O.S dengan memori personal</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-lg bg-[#D7385E] items-center justify-center mr-4">
              <MissionIcon width={16} height={16} />
            </View>
            <Text className="font-jakarta-regular text-[14px] text-black flex-1">Jurnal tanpa limit dengan memori personal AI yang kuat</Text>
          </View>

          <View className="flex-row items-center mb-1">
            <View className="w-8 h-8 rounded-lg bg-[#D7385E] items-center justify-center mr-4">
              <MeditationIcon width={16} height={16} />
            </View>
            <Text className="font-jakarta-regular text-[14px] text-black flex-1">Akses lengkap meditasi</Text>
          </View>
        </View>

        {/* Pahlawan Card */}
        <View className="bg-[#F2F0FC] border-2 border-[#806DE3] rounded-[16px] p-6 mb-6">
          <Text className="font-jakarta-bold text-[20px] text-black mb-3">Pahlawan</Text>
          <View className="flex-row items-end mb-4">
            <Text className="font-jakarta-bold text-[#806DE3] text-[24px] leading-tight">Rp 49.000</Text>
            <Text className="font-jakarta-regular text-[#806DE3] text-[24px] leading-tight">/bln</Text>
          </View>

          <TouchableOpacity
            className="w-full h-[48px] bg-[#806DE3] rounded-[16px] items-center justify-center mb-4"
            activeOpacity={0.8}
          >
            <Text className="font-jakarta-semibold text-[16px] text-white">Dapatkan Paket Pahlawan</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mb-2">
            <Image source={require('../assets/logo-pink.png')} style={{ width: 30, height: 30 }} resizeMode="contain" />
            <Text className="font-jakarta-semibold text-[16px] text-black ml-3">Calmora</Text>
          </View>

          <View className="flex-row items-start mb-4">
            <Ionicons name="checkmark" size={20} color="black" style={{ marginTop: 2 }} />
            <Text className="font-jakarta-regular text-[14px] text-black ml-3 flex-1 leading-tight">
              Hadiahkan satu bulan ruang aman bagi teman yang membutuhkan
            </Text>
          </View>

          <View className="w-full h-[1px] bg-[#806DE3] opacity-20 mb-4" />

          {/* Features */}
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-lg bg-[#806DE3] items-center justify-center mr-4">
              <FeatureStarIcon width={16} height={16} />
            </View>
            <Text className="font-jakarta-regular text-[14px] text-black flex-1">
              Semua fitur <Text className="font-jakarta-bold">"Teman Cerita"</Text>
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-lg bg-[#806DE3] items-center justify-center mr-4">
              <RobotIcon width={26} height={26} />
            </View>
            <Text className="font-jakarta-regular text-[14px] text-black flex-1">Hadiahkan 1 akun untuk user yang membutuhkan</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-lg bg-[#806DE3] items-center justify-center mr-4">
              <MissionIcon width={16} height={16} />
            </View>
            <Text className="font-jakarta-regular text-[14px] text-black flex-1">Dapatkan surat terima kasih dari user yang terbantu</Text>
          </View>

          <View className="flex-row items-center mb-1">
            <View className="w-8 h-8 rounded-lg bg-[#806DE3] items-center justify-center mr-4">
              <SupporterBadgeIcon width={16} height={16} />
            </View>
            <Text className="font-jakarta-regular text-[14px] text-black flex-1">
              Badge khusus untuk maskot sebagai simbol <Text className="font-jakarta-bold">"Supporter"</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
