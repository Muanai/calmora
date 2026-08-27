import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import BellWhiteIcon from "../assets/images/bell-white.svg";

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"promo" | "rewards" | "voucher">("promo");

  return (
    <SafeAreaView className="flex-1 bg-[#fffdf0]" style={{ paddingTop: Platform.OS === 'android' ? 24 : 0 }}>
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-[#D7385E] rounded-xl items-center justify-center">
              <BellWhiteIcon width={16} height={18} />
            </View>
            <Text className="font-jakarta-bold text-xl text-black">Notifikasi</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-gray-200 mx-6" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-6 py-5"
          contentContainerStyle={{ gap: 12, paddingRight: 48 }}
        >
          <TouchableOpacity 
            onPress={() => setActiveTab("promo")}
            className={activeTab === "promo" ? "bg-[#fbebef] border border-[#D7385E] rounded-[20px] px-4 py-1.5 justify-center" : "bg-[#e6e6e6] border border-[#999] rounded-[20px] px-4 py-1.5 justify-center"}
          >
            <Text className={activeTab === "promo" ? "font-jakarta-regular text-[#D7385E] text-xs" : "font-jakarta-regular text-[#999] text-xs"}>Promo dan Info (1)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab("rewards")}
            className={activeTab === "rewards" ? "bg-[#fbebef] border border-[#D7385E] rounded-[20px] px-4 py-1.5 justify-center" : "bg-[#e6e6e6] border border-[#999] rounded-[20px] px-4 py-1.5 justify-center"}
          >
            <Text className={activeTab === "rewards" ? "font-jakarta-regular text-[#D7385E] text-xs" : "font-jakarta-regular text-[#999] text-xs"}>Rewards (1)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab("voucher")}
            className={activeTab === "voucher" ? "bg-[#fbebef] border border-[#D7385E] rounded-[20px] px-4 py-1.5 justify-center" : "bg-[#e6e6e6] border border-[#999] rounded-[20px] px-4 py-1.5 justify-center"}
          >
            <Text className={activeTab === "voucher" ? "font-jakarta-regular text-[#D7385E] text-xs" : "font-jakarta-regular text-[#999] text-xs"}>Voucher (0)</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Notification Item */}
        <View className="px-6 mt-2">
          {activeTab === "promo" && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-full bg-[#fbebef] items-center justify-center">
                    <Ionicons name="notifications" size={16} color="#D7385E" />
                  </View>
                  <Text className="font-jakarta-regular text-[#999] text-xs">Sistem</Text>
                </View>
                <Text className="font-jakarta-regular text-[#999] text-xs">Hari ini</Text>
              </View>
              <Text className="font-jakarta-semibold text-sm text-black mb-1">
                Selamat datang di Calmora! 🎉
              </Text>
              <Text className="font-jakarta-regular text-xs text-black mb-5 leading-5">
                Terima kasih telah bergabung. Mari mulai perjalanan jurnal harianmu dan jaga kesehatan mental bersama Calmora.
              </Text>
            </View>
          )}

          {activeTab === "rewards" && (
            <View>
              {/* Top row: Avatar + Name + Date */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-full bg-[#fbebef] items-center justify-center">
                    <Ionicons name="person" size={16} color="#D7385E" />
                  </View>
                  <Text className="font-jakarta-regular text-[#999] text-xs">Anonim</Text>
                </View>
                <Text className="font-jakarta-regular text-[#999] text-xs">17 Agustus 2026, 15:00</Text>
              </View>

              {/* Title & Body */}
              <Text className="font-jakarta-semibold text-sm text-black mb-1">
                Hari Ini, Ada yang Sedang Menjagamu ❤️
              </Text>
              <Text className="font-jakarta-regular text-xs text-black mb-5 leading-5">
                Selamat! akses Calmora premium telah aktif berkat dukungan hangat dari seorang teman.
              </Text>

              {/* Inner Card */}
              <View className="bg-[#fbebef] border border-[#D7385E] rounded-2xl p-5 mb-8">
                <Text className="font-jakarta-semibold text-sm text-black mb-3">
                  💌 Pesan dari Teman Penjagamu
                </Text>
                <Text className="font-jakarta-regular text-xs text-black leading-5 mb-5">
                  Kamu hebat banget sudah bertahan sejauh ini. Istirahat sejenak ya, jangan dipaksa. Semoga ruang aman ini bisa membantumu bernapas lebih lega hari ini{"\n\n"}
                  - Dari sesama mahasiswa yang memahamimu
                </Text>
                
                <TouchableOpacity className="bg-white rounded-2xl py-3 items-center justify-center">
                  <Text className="font-jakarta-semibold text-[#D7385E] text-base">
                    Balas Pesan Ini
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activeTab === "voucher" && (
            <View className="items-center justify-center mt-10">
              <Text className="font-jakarta-regular text-[#999] text-sm text-center">
                Belum ada voucher saat ini.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
