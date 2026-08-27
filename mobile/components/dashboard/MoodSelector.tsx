import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AngryIcon from "../../assets/angry.svg";
import SadIcon from "../../assets/sad.svg";
import PanicIcon from "../../assets/panic.svg";
import HappyIcon from "../../assets/happy.svg";

const MOODS = [
  { id: "angry", label: "Marah", Icon: AngryIcon, color: "#D7385E" },
  { id: "sad", label: "Sedih", Icon: SadIcon, color: "#806DE3" },
  { id: "panic", label: "Panik", Icon: PanicIcon, color: "#FFC925" },
  { id: "happy", label: "Senang", Icon: HappyIcon, color: "#009455" },
];

export default function MoodSelector() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  return (
    <View className="mb-8 items-center w-full">
      <View className="flex-row justify-between items-center px-8 w-full mb-6">
        {MOODS.map((mood) => (
          <TouchableOpacity 
            key={mood.id} 
            className="items-center gap-2" 
            activeOpacity={0.7}
            onPress={() => setSelectedMood(mood)}
          >
            <mood.Icon width={67} height={70} style={{ overflow: 'visible' }} />
            <Text className="font-jakarta-semibold text-sm text-black text-center">{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Decorative Bottom Line matching Figma */}
      <View className="h-[1px] w-[88%] bg-[#E5E5E5]" />

      <Modal visible={!!selectedMood} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-[16px] p-4 items-center flex-col gap-3 w-full">
            {selectedMood && (
              <>
                <View className="justify-center items-center">
                  <Image
                    source={require("../../assets/images/mascot-lie-down.png")}
                    style={{ width: 110, height: 110 }}
                    resizeMode="contain"
                  />
                </View>
                
                <View className="w-full gap-3">
                  <TouchableOpacity 
                    className="w-full h-12 rounded-[16px] items-center justify-center"
                    style={{ backgroundColor: selectedMood.color }}
                    activeOpacity={0.8}
                    onPress={() => {
                      const moodId = selectedMood.id;
                      setSelectedMood(null);
                      router.push({ pathname: '/write-journal', params: { mood: moodId } });
                    }}
                  >
                    <Text className="font-jakarta-semibold text-[16px] text-white tracking-[0.16px]">Buat Jurnal</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className="w-full h-12 rounded-[16px] items-center justify-center border-2 bg-white"
                    style={{ borderColor: selectedMood.color }}
                    activeOpacity={0.8}
                    onPress={() => setSelectedMood(null)}
                  >
                    <Text className="font-jakarta-semibold text-[16px] tracking-[0.16px]" style={{ color: selectedMood.color }}>Tutup</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
