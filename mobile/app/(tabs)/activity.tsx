import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/expo";
import { useGroundingStore, GroundingSenses } from "../../stores/grounding-store";

const mascotHappyImg = require("../../assets/images/mascot-happy.png");

const SENSE_META: {
  key: keyof GroundingSenses;
  icon: string;
  label: string;
  bgColor: string;
  borderColor: string;
}[] = [
  { key: "lihat", icon: "eye", label: "Lihat", bgColor: "#FBEBEF", borderColor: "#D7385E" },
  { key: "sentuh", icon: "hand-left", label: "Sentuh", bgColor: "#F2F0FC", borderColor: "#806DE3" },
  { key: "dengar", icon: "ear", label: "Dengar", bgColor: "#E6F4EE", borderColor: "#009455" },
  { key: "cium", icon: "rose", label: "Cium", bgColor: "#EBF2FE", borderColor: "#357BF7" },
  { key: "rasa", icon: "restaurant", label: "Rasa", bgColor: "#EFF7F9", borderColor: "#61ADC0" },
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
      <View className="flex-1 bg-[#FFFDF0]">
        <View className="bg-[#D7385E] px-6 pt-14 pb-12 items-center">
          <Text className="font-jakarta-bold text-[24px] text-white text-center mb-2">
            Mari Kembali Beraktivitas
          </Text>
          <Text className="font-jakarta-regular text-[14px] text-white text-center leading-[22px]">
            Nafas pelan-pelan. Kita amati sekitarmu satu per satu tanpa terburu-buru, yaaa!
          </Text>
          {grounding && !isLoading && !isFinished && (
            <View className="mt-4 px-4 py-1.5 rounded-full bg-white/20">
              <Text className="font-jakarta-bold text-[13px] text-white">
                Level {grounding.level} · Langkah {currentStep + 1}/{SENSE_META.length}
              </Text>
            </View>
          )}
        </View>

        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}
        >
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
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: currentMeta.borderColor }}
                  >
                    <Ionicons name={currentMeta.icon as any} size={18} color="white" />
                  </View>
                  <Text className="font-jakarta-bold text-[16px] text-black flex-1">
                    {currentMeta.label} — {currentItems.length} hal
                  </Text>
                </View>
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
