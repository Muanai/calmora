import React from "react";
import { View, Text, TouchableOpacity, Image, Share } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";

// Assets
import ReferralIcon from "../assets/images/referral.svg";
import NomiReferral from "../assets/images/nomi-referral.svg";
const mascotLieDown = require("../assets/images/mascot-lie-down.png");

export default function ReferralScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  // Generate unique-looking key for MVP based on User ID
  const referralCode = user?.id 
    ? `CAL${user.id.substring(user.id.length - 5).toUpperCase()}`
    : "CALRSYA";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Yuk, daftar Calmora! Gunakan kode referralku: ${referralCode}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-[#FFFDF0]">
      {/* Header */}
      <View
        className="z-10 bg-[#FFFDF0] px-6"
        style={{ paddingTop: insets.top + 20 }}
      >
        <View className="flex-row items-center pb-4 border-b border-[#E5E5E5]">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="chevron-left" size={28} color="black" />
          </TouchableOpacity>

          <View className="flex-row items-center flex-1 ml-2">
            <View className="w-10 h-10 bg-[#806DE3] rounded-[10px] items-center justify-center mr-3">
              <ReferralIcon width={22} height={13} />
            </View>
            <Text className="font-jakarta-bold text-[20px] text-black">
              Kode Referral
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center px-6 pt-10 z-10">

        {/* Mascot on top of card */}
        <View className="z-20 -mb-12">
          <Image
            source={mascotLieDown}
            className="w-[30px] h-[30px]"
            resizeMode="contain"
          />
        </View>

        {/* Card */}
        <View className="w-full bg-white rounded-[16px] px-5 py-8 shadow-sm z-10 pt-12 items-center">
          <View className="w-full">
            <Text className="font-jakarta-regular text-[14px] text-[#999999] mb-2">
              Kode Referral Saya:
            </Text>

            <View className="flex-row items-center justify-between w-full mb-6">
              <Text className="font-jakarta-bold text-[32px] text-[#806DE3]">
                {referralCode}
              </Text>

              <TouchableOpacity
                onPress={handleShare}
                className="border-[1.5px] border-[#806DE3] rounded-[12px] px-4 py-2"
              >
                <Text className="font-jakarta-semibold text-[14px] text-[#806DE3]">
                  Bagikan
                </Text>
              </TouchableOpacity>
            </View>

            <View className="w-full h-[1px] bg-[#E5E5E5] mb-6" />

            <Text className="font-jakarta-regular text-[14px] text-[#999999] text-center px-4 leading-[22px]">
              Yuk, ajak teman kamu daftar Calmora menggunakan kode referral-mu
            </Text>
          </View>
        </View>
      </View>

      {/* Giant Nomi Bottom */}
      <View className="absolute bottom-0 w-full items-center justify-end z-0" pointerEvents="none">
        <NomiReferral
          width="110%"
          height={380}
          preserveAspectRatio="xMidYMax meet"
        />
      </View>
    </View>
  );
}
