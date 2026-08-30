import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import RewardPopup from "./RewardPopup";
import { useOutfitsStore } from "../../stores/outfits-store";

// Assets
const windowImg = require("../../assets/images/window.png");
const shelfImg = require("../../assets/images/shelf.png");
const mascotImg = require("../../assets/images/mascot-stand.png");
const outfitsBtnImg = require("../../assets/images/outfits-button.png");
const heartImg = require("../../assets/images/heart-1.png");
const birthdayHat = require("../../assets/acessories/birthday hat.png");
const jewelBlue = require("../../assets/acessories/jewel-blue.png");
const jewelRed = require("../../assets/acessories/jewel-red.png");

const MESSAGES = [
  "Bagaimana Kabarmu Hari ini?",
  "Jangan lupa tarik napas perlahan...",
  "Langkah kecil juga sebuah kemajuan!",
  "Aku di sini untuk mendengarkanmu.",
];

export default function MascotSection() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isRewardPopupVisible, setRewardPopupVisible] = useState(false);
  const { equippedHat, equippedShirt } = useOutfitsStore();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Message rotation
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="h-[360px] relative w-full overflow-visible">
      {/* Background Elements */}
      <Image
        source={windowImg}
        className="absolute left-[-20px] top-[-35px]"
        style={{ width: 264, height: 330 }}
        resizeMode="contain"
      />
      <Image
        source={shelfImg}
        className="absolute right-[-5px] top-[-40px]"
        style={{ width: 275, height: 357 }}
        resizeMode="contain"
      />

      {/* Floating Hearts */}
      <View className="absolute left-[85px] top-[220px] z-10">
        <Animated.Image
          source={heartImg}
          style={{ width: 64, height: 64, transform: [{ translateY: floatAnim }] }}
          resizeMode="contain"
        />
      </View>

      {/* Dynamic Bubble */}
      <View className="absolute right-[30%] top-[95px] bg-pink px-4 py-2 rounded-[16px] shadow-sm max-w-[150px] z-30">
        <Text className="font-jakarta-regular text-[11px] text-white flex-wrap leading-4 text-center">
          {MESSAGES[messageIndex] || "Halo!"}
        </Text>
        {/* Tail indicator */}
        <View className="absolute bottom-[-4px] left-6 w-3 h-3 bg-pink rotate-45" />
      </View>

      {/* Mascot Container (Centered absolutely) */}
      <View className="absolute bottom-[40px] left-1/2 w-[160px] ml-[-80px] items-center z-20">
        <Image
          source={mascotImg}
          style={{ width: 154, height: 187 }}
          resizeMode="contain"
        />

        {/* Equipped Hat */}
        {equippedHat === '1' && (
          <Image
            source={birthdayHat}
            style={{ position: 'absolute', top: -35, left: 47, width: 70, height: 70 }}
            resizeMode="contain"
          />
        )}

        {/* Equipped Shirt / Jewel */}
        {equippedShirt === '2' && (
          <Image
            source={jewelRed}
            style={{ position: 'absolute', top: 102, left: 68, width: 25, height: 25 }}
            resizeMode="contain"
          />
        )}

        {equippedShirt === '3' && (
          <Image
            source={jewelBlue}
            style={{ position: 'absolute', top: 102, left: 68, width: 25, height: 25 }}
            resizeMode="contain"
          />
        )}

        {/* Outfits Button */}
        <TouchableOpacity
          className="absolute bottom-[-45px] z-30"
          activeOpacity={0.8}
          onPress={() => setRewardPopupVisible(true)}
        >
          <Image source={outfitsBtnImg} style={{ width: 90, height: 50 }} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Reward Popup */}
      <RewardPopup
        visible={isRewardPopupVisible}
        onClose={() => setRewardPopupVisible(false)}
      />
    </View>
  );
}
