import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type MissionCardProps = {
  level: "Easy" | "Medium" | "Hard";
  title: string;
  description: string;
  time: string;
};

const LEVEL_STYLES = {
  Easy: {
    container: "bg-pink-light border-pink",
    badge: "bg-pink",
    iconColor: "#D7385E",
  },
  Medium: {
    container: "bg-[#F2F0FC] border-[#806DE3]",
    badge: "bg-[#806DE3]",
    iconColor: "#806DE3",
  },
  Hard: {
    container: "bg-[#EBF2FE] border-[#357BF7]",
    badge: "bg-[#357BF7]",
    iconColor: "#357BF7",
  },
};

function MissionCard({ level, title, description, time }: MissionCardProps) {
  const styles = LEVEL_STYLES[level];

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      className={`border ${styles.container} rounded-[16px] p-4 flex-col`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className={`${styles.badge} px-3 py-1 rounded-[14px]`}>
          <Text className="font-jakarta-semibold text-xs text-white">{level}</Text>
        </View>
        <Ionicons name="play-circle" size={28} color={styles.iconColor} />
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
  );
}

export default function JournalScreen() {
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

        <View className="px-6 mt-6 gap-4">
          <MissionCard
            level="Easy"
            title="Buka Sedikit Celah Udara"
            description="Coba buka tirai atau jendela kamar selebar satu jengkal saja. Biarkan sedikit cahaya baru masuk menyapamu."
            time="2 menit"
          />
          <MissionCard
            level="Medium"
            title="Berdiri di Depan Pintu"
            description="Coba melangkah pelan mendekati pintu kamarmu."
            time="30 detik"
          />
          <MissionCard
            level="Hard"
            title="10 Langkah dari Depan Pintu"
            description="Coba berjalan sejenak ke luar area kamar tidurmu."
            time="Sesukamu"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
