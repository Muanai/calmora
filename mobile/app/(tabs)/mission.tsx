import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Easing } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth, useUser } from "@clerk/expo";
import { useFocusEffect, useRouter } from "expo-router";
import { useMissionStore, Mission } from "../../stores/mission-store";
import ChevronRight from "../../assets/images/chevron-right.svg";

const LEVEL_STYLES = {
  Jurnal: {
    container: "bg-[#F2F0FC] border-[#806DE3]",
    badge: "bg-[#806DE3]",
    iconColor: "#806DE3",
    btnColor: "bg-[#806DE3]",
    borderColor: "border-[#806DE3]",
  },
  Easy: {
    container: "bg-[#FBEBEF] border-[#D7385E]",
    badge: "bg-[#D7385E]",
    iconColor: "#D7385E",
    btnColor: "bg-[#D7385E]",
    borderColor: "border-[#D7385E]",
  },
  Medium: {
    container: "bg-[#EFF7F9] border-[#61ADC0]",
    badge: "bg-[#61ADC0]",
    iconColor: "#61ADC0",
    btnColor: "bg-[#61ADC0]",
    borderColor: "border-[#61ADC0]",
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
  },
};

type MissionCardProps = {
  mission: Mission;
  onComplete: (id: string) => void;
  onJournalPress: () => void;
};

function MissionCard({ mission, onComplete, onJournalPress }: MissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentStyle = mission.is_completed ? LEVEL_STYLES.Completed : LEVEL_STYLES[mission.level as keyof typeof LEVEL_STYLES] || LEVEL_STYLES.Easy;

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const handleActionPress = () => {
    if (mission.is_completed) return;
    onComplete(mission.id);
  };

  return (
    <View className="flex-col mb-4">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsExpanded(!isExpanded)}
        className={`border ${currentStyle.container} rounded-[16px] p-4 flex-col`}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className={`${currentStyle.badge} px-3 py-1 rounded-[14px]`}>
            <Text className="font-jakarta-semibold text-[11px] text-white">
              {mission.badge_text}
            </Text>
          </View>
          <View className={`w-7 h-7 rounded-full ${currentStyle.btnColor} items-center justify-center`}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <ChevronRight width={28} height={28} />
            </Animated.View>
          </View>
        </View>
        <View className="mb-4">
          <Text className="font-jakarta-bold text-base text-black mb-1">{mission.title}</Text>
          <Text className="font-jakarta-regular text-xs text-black leading-[18px]">{mission.description}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="time-outline" size={16} color="#999" />
          <Text className="font-jakarta-regular text-xs text-[#999]">{mission.time}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className={`mt-2 border ${currentStyle.borderColor} bg-white rounded-[16px] p-4 flex-col`}>
          <Text className="font-jakarta-regular text-[14px] text-black leading-[22px] mb-4">
            {mission.long_description}
          </Text>

          <View className="bg-[#FFF4D6] border border-[#FFD600] rounded-[12px] p-3 flex-row items-start mb-4">
            <View className="w-5 h-5 rounded-full bg-[#FFB800] items-center justify-center mr-2 mt-0.5">
              <Text className="font-jakarta-bold text-white text-[10px]">!</Text>
            </View>
            <Text className="font-jakarta-regular text-[12px] text-black flex-1 leading-[18px]">
              <Text className="font-jakarta-bold">Ingat! </Text>
              {mission.warning_text}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleActionPress}
            className={`${mission.is_completed ? LEVEL_STYLES.Completed.btnColor : currentStyle.btnColor} py-3.5 rounded-[12px] items-center justify-center flex-row gap-2`}
          >
            <Text className="font-jakarta-bold text-[16px] text-white">
              {mission.is_completed
                ? "Misi Berhasil"
                : "Tandai Selesai"}
            </Text>
            {mission.is_completed && <Ionicons name="checkmark-circle" size={20} color="white" />}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function MissionScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const { missions, isLoading, fetchMissions, completeMission } = useMissionStore();

  const loadMissions = useCallback(() => {
    if (user?.id) {
      fetchMissions(user.id, getToken);
    }
  }, [user?.id]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  useFocusEffect(
    useCallback(() => {
      loadMissions();
    }, [loadMissions])
  );

  const handleComplete = (missionId: string) => {
    if (user?.id) {
      completeMission(missionId, user.id, getToken);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-pink" edges={["top"]}>
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
          {isLoading ? (
            <View className="items-center justify-center py-16">
              <ActivityIndicator size="large" color="#D7385E" />
              <Text className="font-jakarta-regular text-[14px] text-[#999] mt-4">
                Memuat misi hari ini...
              </Text>
            </View>
          ) : (
            missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onComplete={handleComplete}
                onJournalPress={() => router.push("/journal")}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

