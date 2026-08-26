import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { api } from "../../lib/api";
import { MOOD_STYLES } from "../journal";

interface JournalEntryDetail {
  id: string;
  user_id: string;
  encrypted_content: string;
  mood_tag: string | null;
  title: string | null;
  created_at: string;
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const MOOD_NAMES: Record<string, string> = {
  panic: "Panik",
  sad: "Sedih",
  happy: "Senang",
  angry: "Marah",
};

export default function JournalDetailScreen() {
  const { date: journalId, user_id: paramUserId } = useLocalSearchParams<{ date: string; user_id: string }>();
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [entry, setEntry] = useState<JournalEntryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const userId = paramUserId ?? user?.id ?? "";

  useEffect(() => {
    const load = async () => {
      if (!journalId || !userId) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }
      try {
        const token = await getToken();
        const response = await api.get<JournalEntryDetail>(
          `/journal/entry/${journalId}`,
          {
            params: { user_id: userId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEntry(response.data);
      } catch {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [journalId, userId]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFFDF0] items-center justify-center">
        <ActivityIndicator size="large" color="#806DE3" />
      </SafeAreaView>
    );
  }

  if (notFound || !entry) {
    return (
      <SafeAreaView className="flex-1 bg-[#FFFDF0] items-center justify-center">
        <Text className="font-jakarta-regular text-[16px] text-black">Jurnal tidak ditemukan.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-6 py-2 bg-[#806DE3] rounded-[16px]">
          <Text className="font-jakarta-semibold text-white">Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const dateObj = new Date(entry.created_at);
  const formattedDate = `${dateObj.getDate()} ${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const moodStyle = entry.mood_tag ? MOOD_STYLES[entry.mood_tag] : null;
  const MoodIcon = moodStyle?.Icon ?? null;
  const moodColor = moodStyle?.color ?? "#806DE3";

  return (
    <View className="flex-1 bg-[#FFFDF0]">
      {/* Decorative Top Background */}
      <View className="absolute top-0 w-full h-[320px] items-center overflow-hidden z-0 bg-[#806DE3]">
        <View style={{ position: "absolute", width: 1198, height: 1198, borderRadius: 599, top: 60, alignSelf: "center", backgroundColor: "#D8D2F6" }} />
        <View style={{ position: "absolute", width: 1198, height: 1198, borderRadius: 599, top: 100, alignSelf: "center", backgroundColor: "#ECE9FB" }} />
        <View style={{ position: "absolute", width: 1198, height: 1198, borderRadius: 599, top: 140, alignSelf: "center", backgroundColor: "#FFFDF0" }} />
      </View>

      <SafeAreaView className="flex-1 z-10" edges={["top", "bottom"]}>
        {/* Header Back Button */}
        <View className="px-6 pt-4 pb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            className="w-10 h-10 items-center justify-center rounded-full"
          >
            <Feather name="chevron-left" size={28} color="white" style={{ marginLeft: -10 }} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6 pt-16" showsVerticalScrollIndicator={false}>
          {/* Title Card */}
          <View className="bg-white rounded-[20px] py-3 px-6 items-center justify-center mb-10 mx-2 border-[4px] border-[#FFFDF0]">
            <Text className="font-jakarta-bold text-[18px] text-black text-center">
              {entry.title ?? "Tanpa Judul"}
            </Text>
          </View>

          {/* Metadata Row */}
          <View className="flex-row items-end justify-between mb-4">
            <View className="flex-row items-center">
              {MoodIcon ? (
                <MoodIcon width={48} height={48} style={{ marginRight: 12 }} />
              ) : (
                <View style={{ marginRight: 12 }}>
                  <Feather name="smile" size={40} color="#806DE3" />
                </View>
              )}
              {entry.mood_tag ? (
                <View className="border rounded-[12px] px-3 py-[4px]" style={{ borderColor: moodColor }}>
                  <Text className="font-jakarta-medium text-[12px]" style={{ color: moodColor, transform: [{ translateY: -1 }] }}>
                    {MOOD_NAMES[entry.mood_tag] ?? entry.mood_tag}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text className="font-jakarta-regular text-[12px] text-[#999999] mb-2">
              {timeStr}, {formattedDate}
            </Text>
          </View>

          {/* Journal Content Card */}
          <View
            className="bg-white border rounded-[20px] p-5 mb-8 shadow-sm"
            style={{ borderColor: "#806DE3", shadowColor: "#806DE3", shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }}
          >
            <Text className="font-jakarta-regular text-[14px] text-black leading-6">
              {entry.encrypted_content}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
