import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Modal } from "react-native";
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

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

function getWeekDates(baseDateStr?: string): { day: string; date: number; fullDate: string }[] {
  const today = baseDateStr ? new Date(baseDateStr) : new Date();
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

  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()));
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);

  const weekDates = getWeekDates(selectedDate);

  const loadEntries = useCallback(async (date: Date) => {
    if (!user?.id) return;
    const y = date.getFullYear();
    const m = date.getMonth();
    const startFetch = formatDate(new Date(y, m - 1, 24));
    const endFetch = formatDate(new Date(y, m + 1, 7));
    await fetchEntries(user.id, getToken, startFetch, endFetch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const calendarMonthKey = `${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}`;

  useEffect(() => {
    loadEntries(calendarMonth);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarMonthKey, user?.id]);

  const entriesForSelectedDate = getEntriesForDate(selectedDate);

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setCalendarMonth(new Date(dateStr));
    setIsModalVisible(false);
  };

  const renderCalendar = () => {
    const y = calendarMonth.getFullYear();
    const m = calendarMonth.getMonth();
    const firstDay = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);
    
    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6;
    
    const daysInMonth = lastDay.getDate();
    
    const daysList = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Ming"];
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    const gridDays = [];
    for (let i = 0; i < startOffset; i++) {
       const prevD = new Date(y, m, 0 - (startOffset - 1 - i));
       gridDays.push({ date: prevD, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
       gridDays.push({ date: new Date(y, m, i), isCurrentMonth: true });
    }
    const remaining = gridDays.length % 7 === 0 ? 0 : 7 - (gridDays.length % 7);
    for (let i = 1; i <= remaining; i++) {
       gridDays.push({ date: new Date(y, m + 1, i), isCurrentMonth: false });
    }

    return (
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-[24px] w-full p-6">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => setCalendarMonth(new Date(y, m - 1, 1))} className="py-2 pr-4">
                  <Feather name="chevron-left" size={20} color="#000" />
                </TouchableOpacity>
                <Text className="font-jakarta-bold text-[18px] text-black">
                  {monthNames[m]} {y}
                </Text>
                <TouchableOpacity onPress={() => setCalendarMonth(new Date(y, m + 1, 1))} className="py-2 pl-4">
                  <Feather name="chevron-right" size={20} color="#000" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="p-1" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Feather name="x" size={24} color="#999999" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-between mb-4">
              {daysList.map(d => (
                <View key={d} className="w-[14%] items-center">
                  <Text className="font-jakarta-regular text-[13px] text-[#999999]">{d}</Text>
                </View>
              ))}
            </View>
            
            <View className="flex-row flex-wrap">
              {gridDays.map((item, index) => {
                const dateStr = formatDate(item.date);
                const dayEntries = getEntriesForDate(dateStr);
                const hasEntry = dayEntries.length > 0;
                const newestEntry = hasEntry
                  ? dayEntries.reduce((newest, e) =>
                      new Date(e.created_at) > new Date(newest.created_at) ? e : newest
                    )
                  : null;
                const mood = newestEntry ? newestEntry.mood_tag : null;
                const moodColor = mood && MOOD_STYLES[mood] ? MOOD_STYLES[mood].color : 'transparent';
                
                return (
                  <TouchableOpacity
                    key={index}
                    className="w-[14%] items-center mb-4 h-12 justify-end"
                    onPress={() => {
                      if (item.isCurrentMonth) {
                         handleDateSelect(dateStr);
                      } else {
                         setCalendarMonth(new Date(item.date.getFullYear(), item.date.getMonth(), 1));
                      }
                    }}
                  >
                    <View className="h-[6px] w-[6px] rounded-full mb-1" style={{ backgroundColor: item.isCurrentMonth ? moodColor : 'transparent' }} />
                    <Text className={`font-jakarta-regular text-[14px] ${item.isCurrentMonth ? 'text-black' : 'text-[#999999]'}`}>
                      {String(item.date.getDate()).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Header */}
      <View className="px-6 pt-4 pb-4 flex-row items-center">
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
      
      <View className="h-[1px] bg-[#E5E5E5] mx-6" />

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Date Picker */}
        <View className="flex-row justify-between mb-4">
          {weekDates.map((item) => {
            const isSelected = selectedDate === item.fullDate;
            const dayEntries = getEntriesForDate(item.fullDate);
            const hasEntry = dayEntries.length > 0;
            const newestDayEntry = hasEntry
              ? dayEntries.reduce((newest, e) =>
                  new Date(e.created_at) > new Date(newest.created_at) ? e : newest
                )
              : null;
            const entryMood = newestDayEntry ? newestDayEntry.mood_tag : null;

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
          <TouchableOpacity className="flex-row items-center" onPress={() => {
            setCalendarMonth(new Date(selectedDate));
            setIsModalVisible(true);
          }}>
            <View className="flex-row flex-wrap w-[12px] h-[12px] justify-between mr-[6px] mt-[1px]">
              <View className="w-[5px] h-[5px] bg-[#999999] rounded-[1px] mb-[2px]" />
              <View className="w-[5px] h-[5px] bg-[#999999] rounded-[1px] mb-[2px]" />
              <View className="w-[5px] h-[5px] bg-[#999999] rounded-[1px]" />
              <View className="w-[5px] h-[5px] bg-[#999999] rounded-[1px]" />
            </View>
            <Text className="font-jakarta-regular text-[12px] text-[#999999]">Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* Journal Entry Cards */}
        {isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#806DE3" />
          </View>
        ) : entriesForSelectedDate.length > 0 ? (
          <View style={{ gap: 16 }}>
            {[...entriesForSelectedDate]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((entry) => (
                <View key={entry.id} className="bg-[#ECE9FB] border border-[#806DE3] rounded-[20px] p-5">
                  {entry.title ? (
                    <Text className="font-jakarta-semibold text-[16px] text-black mb-2">
                      {entry.title}
                    </Text>
                  ) : null}
                  <Text className="font-jakarta-regular text-[14px] text-black leading-6">
                    {entry.encrypted_content}
                  </Text>

                  <View className="h-[1px] bg-[#CFC7F5] w-full my-4" />

                  <View className="flex-row items-center justify-between">
                    <View className="w-10 h-10 rounded-[10px] items-center justify-center overflow-hidden">
                      {entry.mood_tag && MOOD_STYLES[entry.mood_tag] ? (
                        (() => {
                          const Icon = MOOD_STYLES[entry.mood_tag].Icon;
                          return <Icon width={40} height={40} />;
                        })()
                      ) : (
                        <Feather name="smile" size={28} color="#806DE3" />
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => router.push(`/journal/${entry.id}?user_id=${user?.id}`)}
                      className="bg-[#806DE3] h-[40px] px-4 items-center justify-center rounded-[16px]"
                    >
                      <Text className="font-jakarta-medium text-white text-[14px]">Selengkapnya</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            ))}
          </View>
        ) : (
          <View className="mt-20 items-center justify-center">
            <Image 
              source={require('../assets/images/mascot-write.png')} 
              style={{ width: 240, height: 240, resizeMode: 'contain' }}
            />
            <Text className="font-jakarta-semibold text-[18px] text-black mt-4 text-center">
              Belum ada jurnal
            </Text>
            <Text className="font-jakarta-regular text-[14px] text-[#999999] mt-2 text-center max-w-[250px]">
              Tulis jurnal untuk mencatat bagaimana perasaanmu hari ini.
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
      
      {renderCalendar()}
    </SafeAreaView>
  );
}
