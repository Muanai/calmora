import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type MissionCardProps = {
  level: "Easy" | "Medium" | "Hard";
  title: string;
  description: string;
  time: string;
  longDescription: string;
  warningText: string;
};

const LEVEL_STYLES = {
  Easy: {
    container: "bg-pink-light border-[#D7385E]",
    badge: "bg-pink",
    iconColor: "#D7385E",
    btnColor: "bg-[#D7385E]",
    borderColor: "border-[#D7385E]",
  },
  Medium: {
    container: "bg-[#F2F0FC] border-[#806DE3]",
    badge: "bg-[#806DE3]",
    iconColor: "#806DE3",
    btnColor: "bg-[#806DE3]",
    borderColor: "border-[#806DE3]",
  },
  Hard: {
    container: "bg-[#EBF2FE] border-[#357BF7]",
    badge: "bg-[#357BF7]",
    iconColor: "#357BF7",
    btnColor: "bg-[#357BF7]",
    borderColor: "border-[#357BF7]",
  },
  Completed: {
    container: "bg-[#EAF5F0] border-[#0F8E52]",
    badge: "bg-[#0F8E52]",
    iconColor: "#0F8E52",
    btnColor: "bg-[#0F8E52]",
    borderColor: "border-[#0F8E52]",
  }
};

function MissionCard({ level, title, description, time, longDescription, warningText }: MissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStyle = isCompleted ? LEVEL_STYLES.Completed : LEVEL_STYLES[level];

  return (
    <View className="flex-col mb-4">
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => setIsExpanded(!isExpanded)}
        className={`border ${currentStyle.container} rounded-[16px] p-4 flex-col`}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className={`${currentStyle.badge} px-3 py-1 rounded-[14px]`}>
            <Text className="font-jakarta-semibold text-[11px] text-white">{level}</Text>
          </View>
          <View className={`w-7 h-7 rounded-full ${currentStyle.btnColor} items-center justify-center ${!isExpanded ? 'pl-0.5' : ''}`}>
             <Ionicons name={isExpanded ? "caret-down" : "play"} size={14} color="white" />
          </View>
        </View>
        <View className="mb-4">
          <Text className="font-jakarta-bold text-base text-black mb-1">{title}</Text>
          <Text className="font-jakarta-regular text-xs text-black leading-[18px]">{description}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="time-outline" size={16} color="#999" />
          <Text className="font-jakarta-regular text-xs text-[#999]">{time}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className={`mt-2 border ${currentStyle.borderColor} bg-white rounded-[16px] p-4 flex-col`}>
          <Text className="font-jakarta-regular text-[14px] text-black leading-[22px] mb-4">
            {longDescription}
          </Text>
          
          <View className="bg-[#FFF4D6] border border-[#FFD600] rounded-[12px] p-3 flex-row items-start mb-4">
             <View className="w-5 h-5 rounded-full bg-[#FFB800] items-center justify-center mr-2 mt-0.5">
               <Text className="font-jakarta-bold text-white text-[10px]">!</Text>
             </View>
             <Text className="font-jakarta-regular text-[12px] text-black flex-1 leading-[18px]">
                <Text className="font-jakarta-bold">Ingat! </Text>
                {warningText}
             </Text>
          </View>

          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => setIsCompleted(!isCompleted)}
            className={`${currentStyle.btnColor} py-3.5 rounded-[12px] items-center justify-center flex-row gap-2`}
          >
            <Text className="font-jakarta-bold text-[16px] text-white">
              {isCompleted ? "Misi Berhasil" : "Tandai Selesai"}
            </Text>
            {isCompleted && <Ionicons name="checkmark-circle" size={20} color="white" />}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function MissionScreen() {
  return (
    <SafeAreaView className="flex-1 bg-pink" edges={['top']}>
      <ScrollView 
        className="flex-1 bg-cream"
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 110 }}
      >
        <View className="bg-pink px-6 pt-14 pb-12 items-center">
          <Text className="font-jakarta-bold text-[24px] text-white text-center mb-2">
            Langkah Kecil Hari Ini
          </Text>
          <Text className="font-jakarta-regular text-[14px] text-white text-center leading-[22px]">
            Pilih satu jika kamu punya energi, simpan dulu jika belum siap.
          </Text>
        </View>

        <View className="px-6 mt-6">
          <MissionCard
            level="Easy"
            title="Buka Sedikit Celah Udara"
            description="Coba buka tirai atau jendela kamar selebar satu jengkal saja. Biarkan sedikit cahaya baru masuk menyapamu."
            time="2 menit"
            longDescription="Buka jendela kamarmu selama 2 menit. Rasakan udara luar yang masuk. Kamu tidak perlu pergi ke mana-mana."
            warningText="Kamu tidak perlu keluar. Cukup di dekat jendela saja, di dalam kamar."
          />
          <MissionCard
            level="Medium"
            title="Berdiri di Depan Pintu"
            description="Coba melangkah pelan mendekati pintu kamarmu."
            time="30 detik"
            longDescription="Coba berdiri santai di depannya selama 30 detik. Pintunya boleh tetap tertutup atau sedikit terbuka, senyamannya kamu"
            warningText="Pintu hanya batas saja dan kamu bisa kembali kapan saja"
          />
          <MissionCard
            level="Hard"
            title="10 Langkah dari Depan Pintu"
            description="Coba berjalan sejenak ke luar area kamar tidurmu."
            time="Sesukamu"
            longDescription="Kamu sudah sangat hebat sampai di titik ini. Yuk, coba buka pintu dan berjalan sejauh 10 langkah dari depan pintu."
            warningText="Tidak ada yang menghakimi kamu, satu langkah saja sudah luar biasa."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
