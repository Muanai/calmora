import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/expo";
import Svg, { Path } from "react-native-svg";
import { useGroundingStore, GroundingSenses } from "../../stores/grounding-store";

const mascotHappyImg = require("../../assets/images/mascot-happy.png");

const LihatIcon = () => (
  <Svg width="19" height="15" viewBox="0 0 19 15" fill="none">
    <Path d="M0 7.5C0.825438 3.23333 4.76471 0 9.49956 0C14.2344 0 18.1737 3.23333 19 7.5C18.1746 11.7667 14.2344 15 9.49956 15C4.76471 15 0.825438 11.7667 0 7.5ZM9.49956 11.6667C10.664 11.6667 11.7808 11.2277 12.6042 10.4463C13.4276 9.66488 13.8902 8.60507 13.8902 7.5C13.8902 6.39493 13.4276 5.33512 12.6042 4.55372C11.7808 3.77232 10.664 3.33333 9.49956 3.33333C8.33509 3.33333 7.21832 3.77232 6.39492 4.55372C5.57152 5.33512 5.10893 6.39493 5.10893 7.5C5.10893 8.60507 5.57152 9.66488 6.39492 10.4463C7.21832 11.2277 8.33509 11.6667 9.49956 11.6667ZM9.49956 10C8.80088 10 8.13082 9.73661 7.63677 9.26777C7.14273 8.79893 6.86518 8.16304 6.86518 7.5C6.86518 6.83696 7.14273 6.20107 7.63677 5.73223C8.13082 5.26339 8.80088 5 9.49956 5C10.1982 5 10.8683 5.26339 11.3623 5.73223C11.8564 6.20107 12.1339 6.83696 12.1339 7.5C12.1339 8.16304 11.8564 8.79893 11.3623 9.26777C10.8683 9.73661 10.1982 10 9.49956 10Z" fill="white"/>
  </Svg>
);

const CiumIcon = () => (
  <Svg width="15" height="17" viewBox="0 0 15 17" fill="none">
    <Path d="M3.55833 4.47695C3.95417 2.6316 5 0 7.5 0C10 0 11.0458 2.6316 11.4417 4.47695C11.65 5.44595 11.9767 6.3818 12.4117 7.27005C13.2558 8.99045 15 10.2366 15 12.325C15 13.114 14.6927 13.8707 14.1457 14.4286C13.5987 14.9866 12.8569 15.3 12.0833 15.3C11.6033 15.3 10.8167 14.9838 10.3725 15.2099C10.0433 15.3782 9.82083 15.7769 9.575 16.0429C9.14167 16.5104 8.52167 17 7.5 17C6.47833 17 5.85833 16.5104 5.425 16.0429C5.17917 15.7769 4.95667 15.3782 4.6275 15.2099C4.18333 14.9838 3.39667 15.3 2.91667 15.3C2.14312 15.3 1.40125 14.9866 0.854272 14.4286C0.307291 13.8707 0 13.114 0 12.325C0 10.2366 1.74417 8.9913 2.58833 7.27005C3.02449 6.38387 3.35035 5.44557 3.55833 4.47695Z" fill="white"/>
  </Svg>
);

const SENSE_META: {
  key: keyof GroundingSenses;
  icon: string | React.FC;
  label: string;
  bgColor: string;
  borderColor: string;
  title: string;
  subtitle: string;
}[] = [
  { 
    key: "lihat", 
    icon: LihatIcon, 
    label: "Lihat", 
    bgColor: "#FBEBEF", 
    borderColor: "#D7385E",
    title: "Temukan 5 hal di sekitarmu",
    subtitle: "Lihat ke sekeliling ruanganmu. Benda apa saja yang tertangkap oleh matamu saat ini?"
  },
  { 
    key: "sentuh", 
    icon: "hand-left", 
    label: "Sentuh", 
    bgColor: "#F2F0FC", 
    borderColor: "#806DE3",
    title: "Rasakan 4 Tekstur Benda",
    subtitle: "Sentuh benda yang paling dekat dengan jangkauan tanganmu. Rasakan permukaannya."
  },
  { 
    key: "dengar", 
    icon: "ear", 
    label: "Dengar", 
    bgColor: "#E6F4EE", 
    borderColor: "#009455",
    title: "Dengarkan 3 Suara di Ruangan",
    subtitle: "Pejamkan mata sejenak kalau nyaman. Suara apa saja yang paling lembut terdengar?"
  },
  { 
    key: "cium", 
    icon: CiumIcon, 
    label: "Cium", 
    bgColor: "#EBF2FE", 
    borderColor: "#357BF7",
    title: "Cium 2 Aroma di Dekatmu",
    subtitle: "Tarik napas perlahan... Apakah ada aroma sederhana yang bisa kamu hirup saat ini?"
  },
  { 
    key: "rasa", 
    icon: "restaurant", 
    label: "Rasa", 
    bgColor: "#EFF7F9", 
    borderColor: "#61ADC0",
    title: "Rasakan 1 Hal di Mulutmu",
    subtitle: "Rasakan sisa rasa yang ada di mulutmu saat ini. Kamu juga bisa mengambil satu teguk air jika ada di dekatmu."
  },
];

export default function ActivityScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { grounding, isLoading, fetchGrounding, completeGrounding } = useGroundingStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchGrounding(user.id, getToken);
    }
  }, [user?.id]);

  const currentMeta = SENSE_META[currentStep] ?? SENSE_META[0];
  const currentItems = grounding?.senses?.[currentMeta.key] ?? [];

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const isAllChecked = currentItems.length > 0 && checkedCount === currentItems.length;

  const handleNext = () => {
    if (currentStep < SENSE_META.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setCheckedItems({});
    } else {
      setIsFinished(true);
      setCheckedItems({});
      if (user?.id && !grounding?.is_completed) {
        completeGrounding(user.id, getToken);
      }
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCheckedItems({});
    setIsFinished(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#D7385E]" edges={["top"]}>
        <View className="flex-1 bg-[#FFFDF0] items-center justify-center">
          <ActivityIndicator size="large" color="#D7385E" />
          <Text className="font-jakarta-regular text-[14px] text-[#999] mt-4">
            Menyiapkan aktivitas...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#D7385E]" edges={["top"]}>
      <ScrollView
        className="flex-1 bg-[#FFFDF0]"
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
      >
        <View className="bg-[#D7385E] px-6 pt-14 pb-12 items-center">
          <Text className="font-jakarta-bold text-[24px] text-white text-center mb-2">
            Mari Kembali Beraktivitas
          </Text>
          <Text className="font-jakarta-regular text-[14px] text-white text-center leading-[22px]">
            Nafas pelan-pelan. Kita amati sekitarmu satu per satu tanpa terburu-buru, yaaa!
          </Text>
        </View>

        <View className="px-6 mt-6">
          {isFinished ? (
            <View className="items-center justify-center pt-8">
              <Image
                source={mascotHappyImg}
                style={{ width: 296, height: 275 }}
                resizeMode="contain"
              />
              <Text className="font-jakarta-bold text-[20px] text-black text-center mt-6 mb-3">
                Kamu Hebat Banget!
              </Text>
              <Text className="font-jakarta-regular text-[14px] text-[#A7A7A7] text-center leading-[21px] px-2 mb-8">
                Pikiran dan tubuhmu sudah kembali terhubung dengan aman. Kamu berhasil melewatinya langkah demi langkah.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleRestart}
                className="bg-[#D7385E] w-full h-[48px] flex-row items-center justify-center gap-2 rounded-[16px]"
              >
                <Text className="font-jakarta-semibold text-[16px] text-white">
                  Ulangi Lagi
                </Text>
                <Ionicons name="refresh" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View
                className="border rounded-[16px] p-4 mb-6 shadow-sm"
                style={{ backgroundColor: currentMeta.bgColor, borderColor: currentMeta.borderColor }}
              >
                <View className="flex-row items-center gap-3 mb-3">
                  <View
                    className="w-8 h-8 rounded-lg items-center justify-center"
                    style={{ backgroundColor: currentMeta.borderColor }}
                  >
                    {typeof currentMeta.icon === "string" ? (
                      <Ionicons name={currentMeta.icon as any} size={18} color="white" />
                    ) : (
                      <currentMeta.icon />
                    )}
                  </View>
                  <Text className="font-jakarta-semibold text-[16px] text-black flex-1">
                    {currentMeta.title}
                  </Text>
                </View>
                <Text className="font-jakarta-regular text-[12px] text-black leading-[18px]">
                  {currentMeta.subtitle}
                </Text>
              </View>

              <View className="flex-col gap-3 mb-6">
                {currentItems.map((item, index) => {
                  const isChecked = !!checkedItems[index];
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => toggleItem(index)}
                      className="flex-row items-center h-[48px] px-4 rounded-[16px] border"
                      style={{
                        backgroundColor: isChecked ? currentMeta.bgColor : "#FFFDF0",
                        borderColor: isChecked ? currentMeta.borderColor : "#D9D9D9",
                      }}
                    >
                      <Ionicons
                        name={isChecked ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color={isChecked ? currentMeta.borderColor : "#D9D9D9"}
                      />
                      <Text
                        className="font-jakarta-semibold text-[14px] ml-3 flex-1"
                        style={{ color: isChecked ? currentMeta.borderColor : "black" }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View className="flex-row items-center mb-8 gap-4">
                <View className="flex-1 h-[5px] bg-[#D9D9D9] rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${currentItems.length > 0 ? (checkedCount / currentItems.length) * 100 : 0}%`,
                      backgroundColor: currentMeta.borderColor,
                    }}
                  />
                </View>
                <Text className="font-jakarta-bold text-[14px] text-[#999999]">
                  {checkedCount}/{currentItems.length}
                </Text>
              </View>

              <View className="items-center">
                <TouchableOpacity
                  disabled={!isAllChecked}
                  activeOpacity={0.8}
                  onPress={handleNext}
                  className={`w-full h-[48px] flex-row items-center justify-center gap-2 rounded-[16px] mb-2 ${isAllChecked ? "bg-[#D7385E]" : "bg-[#CCCCCC]"}`}
                >
                  <Text className={`font-jakarta-bold text-[16px] ${isAllChecked ? "text-white" : "text-[#999999]"}`}>
                    {currentStep < SENSE_META.length - 1 ? "Langkah Berikutnya" : "Selesai"}
                  </Text>
                  {currentStep < SENSE_META.length - 1 && (
                    <Ionicons name="arrow-forward" size={20} color={isAllChecked ? "white" : "#999999"} />
                  )}
                </TouchableOpacity>
                <Text className="font-jakarta-regular text-[12px] text-[#999999] text-center mt-1">
                  {isAllChecked
                    ? currentStep < SENSE_META.length - 1
                      ? "Kerja bagus! Mari kita lanjut."
                      : "Luar biasa! Kamu telah lebih tenang."
                    : "Centang semua item untuk lanjut"}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
