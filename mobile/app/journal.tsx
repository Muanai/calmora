import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import PencilIcon from "../assets/images/pencil.svg";
import AngryIcon from "../assets/angry.svg";
import HappyIcon from "../assets/happy.svg";
import PanicIcon from "../assets/panic.svg";
import SadIcon from "../assets/sad.svg";

export const MOOD_STYLES: Record<string, { color: string; Icon: React.FC<any>; bgIconColor: string }> = {
  sad: { color: "#357BF7", Icon: SadIcon, bgIconColor: "#EBF2FE" },
  panic: { color: "#FFD166", Icon: PanicIcon, bgIconColor: "#FFF9E6" },
  happy: { color: "#009455", Icon: HappyIcon, bgIconColor: "#E6F4EE" },
  angry: { color: "#D7385E", Icon: AngryIcon, bgIconColor: "#FBEBEF" },
};

// Mock data
export const MOCK_JOURNAL_DATA: Record<string, { title: string; mood: string; text: string; time: string }> = {
  "2026-08-17": {
    title: "Panik mikirin kerjaan",
    mood: "panic",
    text: "Hari ini rasanya panik terus, deg-degan dari pagi. Kerjaan menumpuk dan aku merasa kurang persiapan untuk presentasi besok.",
    time: "09:00",
  },
  "2026-08-18": {
    title: "Entahlah",
    mood: "sad",
    text: "Sedih banget hari ini, nggak tau kenapa pengen nangis. Mungkin karena kurang tidur atau kecapekan.",
    time: "21:30",
  },
  "2026-08-19": {
    title: "Hari ini OVT banget",
    mood: "panic",
    text: "Duh, hari ini rasanya capek banget. Kerjaan di kantor nggak habis-habis, tadi juga sempat berdebat sama rekan kerja gara-gara hal sepele. Rasanya kesal tapi juga sedih. Aku cuma pengen pulang, rebahan, nggak mikirin apa-apa. Kenapa ya rasanya susah banget buat santai sedikit aja. Besok ada deadline lagi, semoga bisa selesai tepat waktu. Aku butuh kopi. Atau cokelat? Mungkin cokelat lebih baik. Breathe in, breathe out... Okay, fokus lagi.",
    time: "15:00",
  },
};

const WEEK_DATES = [
  { day: "Sen", date: 17, fullDate: "2026-08-17" },
  { day: "Sel", date: 18, fullDate: "2026-08-18" },
  { day: "Rab", date: 19, fullDate: "2026-08-19" },
  { day: "Kam", date: 20, fullDate: "2026-08-20" },
  { day: "Jum", date: 21, fullDate: "2026-08-21" },
  { day: "Sab", date: 22, fullDate: "2026-08-22" },
  { day: "Ming", date: 23, fullDate: "2026-08-23" },
];

export default function JurnalScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("2026-08-19");

  const currentEntry = MOCK_JOURNAL_DATA[selectedDate];

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 border-b border-[#E5E5E5] flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="chevron-left" size={28} color="#999999" />
        </TouchableOpacity>

        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 bg-[#806DE3] rounded-[12px] items-center justify-center mr-3">
            <PencilIcon width={24} height={24} color="white" />
          </View>
          <View>
            <Text className="font-jakarta-bold text-[20px] text-black">Jurnal Kecemasanku</Text>
            <Text className="font-jakarta-regular text-[13px] text-[#999999]">Tulis dan luapkan isi pikiranmu.</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Date Picker */}
        <View className="flex-row justify-between mb-4">
          {WEEK_DATES.map((item) => {
            const isSelected = selectedDate === item.fullDate;
            const entryInfo = MOCK_JOURNAL_DATA[item.fullDate];
            const hasEntry = !!entryInfo;

            let bgColor = "bg-[#EBEBEB]";
            let textColor = "text-[#A1A1A1]";
            let borderColor = "border-transparent";

            let dayBgStyle = { backgroundColor: "transparent" };
            let dayTextColor = "text-black";
            let dateBoxStyle: any = { backgroundColor: "#EBEBEB", borderColor: "transparent" };

            if (isSelected) {
              dateBoxStyle = { backgroundColor: "#FFFFFF", borderColor: "#806DE3" };
              textColor = "text-[#806DE3]";
              dayBgStyle = { backgroundColor: "#806DE3" };
              dayTextColor = "text-white";
            } else if (hasEntry) {
              dateBoxStyle = { backgroundColor: MOOD_STYLES[entryInfo.mood].color, borderColor: "transparent" };
              textColor = "text-white";
            }

            return (
              <TouchableOpacity
                key={item.fullDate}
                onPress={() => setSelectedDate(item.fullDate)}
                className="items-center"
              >
                <View style={dayBgStyle} className={`px-2 py-1 rounded-[8px] mb-2`}>
                  <Text className={`font-jakarta-regular text-[12px] ${dayTextColor}`}>
                    {item.day}
                  </Text>
                </View>
                <View
                  style={dateBoxStyle}
                  className={`w-10 h-10 rounded-[12px] items-center justify-center border`}
                >
                  <Text 
                    className={`font-jakarta-semibold text-[16px] ${textColor}`}
                    style={{ includeFontPadding: false, transform: [{ translateY: -1 }] }}
                  >
                    {item.date}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lihat Semua */}
        <View className="flex-row justify-end mb-4">
          <TouchableOpacity className="flex-row items-center">
            <Feather name="grid" size={14} color="#999999" style={{ marginRight: 6 }} />
            <Text className="font-jakarta-regular text-[12px] text-[#999999]">Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* Journal Entry Card */}
        {currentEntry ? (
          <View className="bg-[#ECE9FB] border border-[#806DE3] rounded-[20px] p-5">
            <Text className="font-jakarta-regular text-[14px] text-black leading-6">
              {currentEntry.text}
            </Text>

            <View className="h-[1px] bg-[#CFC7F5] w-full my-4" />

            <View className="flex-row items-center justify-between">
              <View className="w-10 h-10 rounded-[10px] items-center justify-center overflow-hidden">
                {(() => {
                  const Icon = MOOD_STYLES[currentEntry.mood].Icon;
                  return <Icon width={40} height={40} />;
                })()}
              </View>
              <TouchableOpacity 
                onPress={() => router.push(`/journal/${selectedDate}`)}
                className="bg-[#806DE3] h-[40px] px-4 items-center justify-center rounded-[16px]"
              >
                <Text className="font-jakarta-medium text-white text-[14px]">Selengkapnya</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="bg-white border border-[#E5E5E5] rounded-[20px] p-6 items-center justify-center mt-4">
            <Feather name="book" size={40} color="#D9D9D9" />
            <Text className="font-jakarta-regular text-[14px] text-[#999999] mt-3 text-center">
              Belum ada catatan jurnal untuk hari ini.
            </Text>
          </View>
        )}

        <View className="h-32" />
      </ScrollView>

      {/* Bottom Input Area */}
      <View className="px-6 pt-4 pb-4 bg-cream" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <TouchableOpacity
          onPress={() => router.push('/write-journal')}
          className="bg-[#806DE3] h-[48px] rounded-[16px] flex-row items-center justify-center shadow-sm"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
        >
          <Text className="font-jakarta-semibold text-[16px] text-white tracking-[0.16px] mr-[10px]">
            Buat Jurnal
          </Text>
          <PencilIcon width={24} height={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
