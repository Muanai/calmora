import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/expo";
import PencilIcon from "../assets/images/pencil.svg";
import AngryIcon from "../assets/angry.svg";
import HappyIcon from "../assets/happy.svg";
import PanicIcon from "../assets/panic.svg";
import SadIcon from "../assets/sad.svg";
import { useJournalStore, JournalEntry } from "../stores/journal-store";

export const MOOD_STYLES: Record<string, { color: string; Icon: React.FC<any>; bgIconColor: string }> = {
  sad: { color: "#357BF7", Icon: SadIcon, bgIconColor: "#EBF2FE" },
  panic: { color: "#FFD166", Icon: PanicIcon, bgIconColor: "#FFF9E6" },
  happy: { color: "#009455", Icon: HappyIcon, bgIconColor: "#E6F4EE" },
  angry: { color: "#D7385E", Icon: AngryIcon, bgIconColor: "#FBEBEF" },
};

function getWeekDates(): { day: string; date: number; fullDate: string }[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return {
      day: days[d.getDay()],
      date: d.getDate(),
      fullDate: `${y}-${m}-${dd}`,
    };
  });
}

export default function JurnalScreen() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();

  const { entries, isLoading, fetchEntries, getEntriesForDate } = useJournalStore();

  const weekDates = getWeekDates();
  const todayStr = weekDates.find((_, i) => {
    const d = new Date(weekDates[0].fullDate);
    d.setDate(d.getDate() + i);
    return d.toDateString() === new Date().toDateString();
  })?.fullDate ?? weekDates[weekDates.length - 1].fullDate;

  const [selectedDate, setSelectedDate] = useState(todayStr);

  const loadEntries = useCallback(async () => {
    if (!user?.id) return;
    const startDate = weekDates[0].fullDate;
    const endDate = weekDates[6].fullDate;
    await fetchEntries(user.id, getToken, startDate, endDate);
  }, [user?.id]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const entriesForSelectedDate = getEntriesForDate(selectedDate);
  const currentEntry: JournalEntry | undefined = entriesForSelectedDate[0];

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
          {weekDates.map((item) => {
            const isSelected = selectedDate === item.fullDate;
            const dayEntries = getEntriesForDate(item.fullDate);
            const hasEntry = dayEntries.length > 0;
            const entryMood = hasEntry ? dayEntries[0].mood_tag : null;

            let dayBgStyle: any = { backgroundColor: "transparent" };
            let dayTextColor = "text-black";
            let dateBoxStyle: any = { backgroundColor: "#EBEBEB", borderColor: "transparent" };
            let textColor = "text-[#A1A1A1]";

            if (isSelected) {
              dateBoxStyle = { backgroundColor: "#FFFFFF", borderColor: "#806DE3" };
              textColor = "text-[#806DE3]";
              dayBgStyle = { backgroundColor: "#806DE3" };
              dayTextColor = "text-white";
            } else if (hasEntry && entryMood && MOOD_STYLES[entryMood]) {
              dateBoxStyle = { backgroundColor: MOOD_STYLES[entryMood].color, borderColor: "transparent" };
              textColor = "text-white";
            }

            return (
              <TouchableOpacity
                key={item.fullDate}
                onPress={() => setSelectedDate(item.fullDate)}
                className="items-center"
              >
                <View style={dayBgStyle} className="px-2 py-1 rounded-[8px] mb-2">
                  <Text className={`font-jakarta-regular text-[12px] ${dayTextColor}`}>
                    {item.day}
                  </Text>
                </View>
                <View
                  style={dateBoxStyle}
                  className="w-10 h-10 rounded-[12px] items-center justify-center border"
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
          <TouchableOpacity className="flex-row items-center" onPress={loadEntries}>
            <Feather name="refresh-cw" size={14} color="#999999" style={{ marginRight: 6 }} />
            <Text className="font-jakarta-regular text-[12px] text-[#999999]">Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Journal Entry Card */}
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#806DE3" />
          </View>
        ) : currentEntry ? (
          <View className="bg-[#ECE9FB] border border-[#806DE3] rounded-[20px] p-5">
            {currentEntry.title ? (
              <Text className="font-jakarta-semibold text-[16px] text-black mb-2">
                {currentEntry.title}
              </Text>
            ) : null}
            <Text className="font-jakarta-regular text-[14px] text-black leading-6">
              {currentEntry.encrypted_content}
            </Text>

            <View className="h-[1px] bg-[#CFC7F5] w-full my-4" />

            <View className="flex-row items-center justify-between">
              <View className="w-10 h-10 rounded-[10px] items-center justify-center overflow-hidden">
                {currentEntry.mood_tag && MOOD_STYLES[currentEntry.mood_tag] ? (
                  (() => {
                    const Icon = MOOD_STYLES[currentEntry.mood_tag!].Icon;
                    return <Icon width={40} height={40} />;
                  })()
                ) : (
                  <Feather name="smile" size={28} color="#806DE3" />
                )}
              </View>
              <TouchableOpacity
                onPress={() => router.push(`/journal/${currentEntry.id}?user_id=${user?.id}`)}
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
      <View className="px-6 pt-4 pb-4 bg-cream" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <TouchableOpacity
          onPress={() => router.push("/write-journal")}
          className="bg-[#806DE3] h-[48px] rounded-[16px] flex-row items-center justify-center shadow-sm"
          style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
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
