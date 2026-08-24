import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import PencilIcon from "../assets/images/pencil.svg";
import AngryIcon from "../assets/angry.svg";
import SadIcon from "../assets/sad.svg";
import PanicIcon from "../assets/panic.svg";
import HappyIcon from "../assets/happy.svg";

const MOODS = [
  { id: "angry", name: "Marah", color: "#D7385E", Icon: AngryIcon },
  { id: "sad", name: "Sedih", color: "#357BF7", Icon: SadIcon },
  { id: "panic", name: "Panik", color: "#FFC925", Icon: PanicIcon },
  { id: "happy", name: "Senang", color: "#009455", Icon: HappyIcon },
];

export default function WriteJournalScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-[#FFFDF0]">
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-8 pb-4 flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="chevron-left" size={28} color="#000" />
            </TouchableOpacity>

            <View className="w-10 h-10 bg-[#806DE3] rounded-[12px] mr-3 items-center justify-center">
              <PencilIcon width={24} height={24} />
            </View>
            
            <View className="flex-1 justify-center">
              <Text className="font-jakarta-bold text-[20px] text-black leading-tight">
                Jurnal Kecemasanku
              </Text>
              <Text className="font-jakarta-regular text-[14px] text-[#999999] mt-[2px]">
                Tulis dan luapkan isi pikiranmu.
              </Text>
            </View>
          </View>
          
          {/* Divider Line */}
          <View className="h-[1px] bg-[#E5E5E5] w-full mb-8" />

          <View className="px-6">
            {/* Mood Selector */}
            <View className="flex-row justify-between mb-8">
              {MOODS.map((mood) => {
                const isSelected = selectedMood === mood.id;
                const Icon = mood.Icon;
                return (
                  <TouchableOpacity 
                    key={mood.id} 
                    className="items-center"
                    onPress={() => setSelectedMood(mood.id)}
                  >
                    <View 
                      className={`items-center justify-center mb-1 rounded-[16px] ${isSelected ? 'border-2 border-black' : ''}`}
                    >
                      <Icon width={67} height={80} />
                    </View>
                    <Text className="font-jakarta-medium text-[16px] text-black text-center mt-1">
                      {mood.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time & Date */}
            <View className="flex-row justify-between mb-4">
              <View className="flex-row items-center border border-[#999999] rounded-[16px] h-[48px] px-4 mr-4">
                <Feather name="clock" size={20} color="#999999" style={{ marginRight: 8 }} />
                <Text className="font-jakarta-regular text-[14px] text-[#999999]">
                  00:00
                </Text>
              </View>
              <View className="flex-1 flex-row items-center border border-[#999999] rounded-[16px] h-[48px] px-4">
                <Feather name="calendar" size={20} color="#999999" style={{ marginRight: 8 }} />
                <Text className="font-jakarta-regular text-[14px] text-[#999999]">
                  MM/DD/YYYY
                </Text>
              </View>
            </View>

            {/* Form */}
            <View className="bg-white border border-[#999999] rounded-[16px] p-4 min-h-[311px]">
              <TextInput
                placeholder="Judul"
                placeholderTextColor="#999999"
                className="font-jakarta-regular text-[16px] text-black mb-3"
                style={{ outlineStyle: 'none' } as any}
              />
              <TextInput
                placeholder="Isi"
                placeholderTextColor="#999999"
                multiline
                textAlignVertical="top"
                className="font-jakarta-regular text-[14px] text-black flex-1"
                style={{ outlineStyle: 'none' } as any}
              />
            </View>

            {/* Simpan Button */}
            <TouchableOpacity
              className="bg-[#806DE3] h-12 rounded-[16px] items-center justify-center mt-[18px]"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4
              }}
            >
              <Text className="font-jakarta-semibold text-[16px] text-white tracking-[0.16px]">Simpan</Text>
            </TouchableOpacity>
          </View>

          {/* Decorative Circles */}
          <View className="relative mt-[29px] flex-1 min-h-[150px] w-full items-center overflow-hidden">
            <View style={{ position: 'absolute', width: 1198, height: 1198, borderRadius: 599, top: 0, alignSelf: 'center', backgroundColor: '#ECE9FB' }} />
            <View style={{ position: 'absolute', width: 1198, height: 1198, borderRadius: 599, top: 46, alignSelf: 'center', backgroundColor: '#D8D2F6' }} />
            <View style={{ position: 'absolute', width: 1198, height: 1198, borderRadius: 599, top: 90, alignSelf: 'center', backgroundColor: '#806DE3' }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
