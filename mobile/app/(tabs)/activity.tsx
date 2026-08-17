import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const mascotHappyImg = require("../../assets/images/mascot-happy.png");

const GROUNDING_STEPS = [
  {
    icon: "eye",
    title: "Temukan 5 hal di sekitarmu",
    desc: "Lihat ke sekeliling ruanganmu. Benda apa saja yang tertangkap oleh matamu saat ini?",
    items: ["Meja belajar", "Jendela kamar", "Botol minum", "Tas ransel", "Bantal atau selimut"],
    bgColor: "#FBEBEF",
    borderColor: "#D7385E"
  },
  {
    icon: "hand-left",
    title: "Rasakan 4 Tekstur Benda",
    desc: "Sentuh benda yang paling dekat dengan jangkauan tanganmu. Rasakan permukaannya.",
    items: ["Kasur yang lembut", "Dinding yang dingin", "Pakaian yang kamu pakai", "Rambut atau kulitmu sendiri"],
    bgColor: "#F2F0FC",
    borderColor: "#806DE3"
  },
  {
    icon: "ear",
    title: "Dengarkan 3 Suara di Ruangan",
    desc: "Pejamkan mata sejenak kalau nyaman. Suara apa saja yang paling lembut terdengar?",
    items: ["Kipas angin berputar", "Suara dari luar jendela", "Suara nafasmu sendiri"],
    bgColor: "#E6F4EE",
    borderColor: "#009455"
  },
  {
    icon: "rose",
    title: "Amati 2 Aroma di Dekatmu",
    desc: "Tarik napas perlahan... Apakah ada aroma sederhana yang bisa kamu hirup saat ini?",
    items: ["Aroma kamarmu", "Aroma pakaianmu"],
    bgColor: "#EBF2FE",
    borderColor: "#357BF7"
  },
  {
    icon: "restaurant",
    title: "Rasakan 1 Hal di Mulutmu",
    desc: "Rasakan sisa rasa yang ada di mulutmu saat ini. Kamu juga bisa mengambil satu teguk air jika ada di dekatmu.",
    items: ["Rasa Air Minum atau Rasa Mulutmu"],
    bgColor: "#EFF7F9",
    borderColor: "#61ADC0"
  }
];

export default function ActivityScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const stepData = GROUNDING_STEPS[currentStep] || GROUNDING_STEPS[0];
  const items = stepData.items;

  const toggleItem = (index: number) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const isAllChecked = checkedCount === items.length;

  const handleNext = () => {
    if (currentStep < GROUNDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCheckedItems({}); // reset checklist for next step
    } else {
      // Show success screen
      setCurrentStep(GROUNDING_STEPS.length);
      setCheckedItems({});
    }
  };

  const handleFinish = () => {
    setCurrentStep(0);
    setCheckedItems({});
  };

  const isSuccessScreen = currentStep === GROUNDING_STEPS.length;

  return (
    <SafeAreaView className="flex-1 bg-[#D7385E]" edges={['top']}>
      <View className="flex-1 bg-[#FFFDF0]">
        
        {/* Top Pink Header (No longer overlapping) */}
        <View className="bg-[#D7385E] px-6 pt-14 pb-12 items-center">
          <Text className="font-jakarta-bold text-[24px] text-white text-center mb-2">
            Mari Kembali Beraktivitas
          </Text>
          <Text className="font-jakarta-regular text-[14px] text-white text-center leading-[22px]">
            Nafas pelan-pelan. Kita amati sekitarmu satu per satu tanpa terburu-buru, yaaa!
          </Text>
        </View>

        <ScrollView 
          className="flex-1 px-6" 
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {isSuccessScreen ? (
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
                onPress={handleFinish}
                className="bg-[#D7385E] w-full h-[48px] flex-row items-center justify-center gap-2 rounded-[16px]"
              >
                <Text className="font-jakarta-semibold text-[16px] text-white">
                  Level Selanjutnya
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Main Instruction Card */}
              <View 
                className="border rounded-[16px] p-4 mb-6 shadow-sm"
                style={{ backgroundColor: stepData.bgColor, borderColor: stepData.borderColor }}
              >
                <View className="flex-row items-center gap-3 mb-3">
                  <View 
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: stepData.borderColor }}
                  >
                    <Ionicons name={stepData.icon as any} size={18} color="white" />
                  </View>
                  <Text className="font-jakarta-bold text-[16px] text-black flex-1">
                    {stepData.title}
                  </Text>
                </View>
                <Text className="font-jakarta-regular text-[12px] text-black leading-[18px]">
                  {stepData.desc}
                </Text>
              </View>

              {/* Checklist Items */}
              <View className="flex-col gap-3 mb-6">
                {items.map((item, index) => {
                  const isChecked = checkedItems[index];
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => toggleItem(index)}
                      className="flex-row items-center h-[48px] px-4 rounded-[16px] border"
                      style={{ 
                        backgroundColor: isChecked ? stepData.bgColor : '#FFFDF0',
                        borderColor: isChecked ? stepData.borderColor : '#D9D9D9'
                      }}
                    >
                      <Ionicons 
                        name={isChecked ? "checkmark-circle" : "ellipse-outline"} 
                        size={24} 
                        color={isChecked ? stepData.borderColor : "#D9D9D9"} 
                      />
                      <Text 
                        className="font-jakarta-semibold text-[14px] ml-3"
                        style={{ color: isChecked ? stepData.borderColor : 'black' }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Progress Bar */}
              <View className="flex-row items-center mb-8 gap-4">
                <View className="flex-1 h-[5px] bg-[#D9D9D9] rounded-full overflow-hidden">
                  <View 
                    className="h-full rounded-full" 
                    style={{ width: `${(checkedCount / items.length) * 100}%`, backgroundColor: stepData.borderColor }}
                  />
                </View>
                <Text className="font-jakarta-bold text-[14px] text-[#999999]">
                  {checkedCount}/{items.length}
                </Text>
              </View>

              {/* Next Action Button */}
              <View className="items-center">
                <TouchableOpacity 
                  disabled={!isAllChecked}
                  activeOpacity={0.8}
                  onPress={handleNext}
                  className={`w-full h-[48px] flex-row items-center justify-center gap-2 rounded-[16px] mb-2 ${isAllChecked ? 'bg-[#D7385E]' : 'bg-[#CCCCCC]'}`}
                >
                  <Text className={`font-jakarta-bold text-[16px] ${isAllChecked ? 'text-white' : 'text-[#999999]'}`}>
                    {currentStep < GROUNDING_STEPS.length - 1 ? "Langkah Berikutnya" : "Selesai"}
                  </Text>
                  {currentStep < GROUNDING_STEPS.length - 1 && (
                    <Ionicons name="arrow-forward" size={20} color={isAllChecked ? "white" : "#999999"} />
                  )}
                </TouchableOpacity>
                
                <Text className="font-jakarta-regular text-[12px] text-[#999999] text-center mt-1">
                  {isAllChecked 
                    ? (currentStep < GROUNDING_STEPS.length - 1 ? 'Kerja bagus! Mari kita lanjut.' : 'Luar biasa! Kamu telah lebih tenang.') 
                    : 'Centang semua item untuk lanjut'}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
