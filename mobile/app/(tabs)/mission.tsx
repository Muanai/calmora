import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/expo";
import { useMissionStore, MissionSenses } from "../../stores/mission-store";

const SENSE_CONFIG: { key: keyof MissionSenses; label: string; emoji: string; count: number }[] = [
  { key: "lihat", label: "Lihat", emoji: "👁", count: 5 },
  { key: "sentuh", label: "Sentuh", emoji: "✋", count: 4 },
  { key: "dengar", label: "Dengar", emoji: "👂", count: 3 },
  { key: "cium", label: "Cium", emoji: "👃", count: 2 },
  { key: "rasa", label: "Rasa", emoji: "👅", count: 1 },
];

const LEVEL_STYLES = {
  Easy: { bg: "bg-pink", badge: "bg-[#D7385E]", border: "border-[#D7385E]", check: "#D7385E" },
  Medium: { bg: "bg-[#806DE3]", badge: "bg-[#806DE3]", border: "border-[#806DE3]", check: "#806DE3" },
  Hard: { bg: "bg-[#357BF7]", badge: "bg-[#357BF7]", border: "border-[#357BF7]", check: "#357BF7" },
};

export default function MissionScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { mission, isLoading, fetchMission, completeMission } = useMissionStore();

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user?.id) {
      fetchMission(user.id, getToken);
    }
  }, [user?.id]);

  useEffect(() => {
    setChecked({});
  }, [mission?.level]);

  const toggleCheck = (key: string) => {
    if (mission?.is_completed) return;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = mission
    ? Object.values(mission.senses).reduce((sum, arr) => sum + arr.length, 0)
    : 0;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = totalItems > 0 && checkedCount >= totalItems;

  const handleComplete = () => {
    if (!user?.id || !allChecked || mission?.is_completed) return;
    completeMission(user.id, getToken);
  };

  const levelStyle = mission ? LEVEL_STYLES[mission.level] : LEVEL_STYLES.Easy;

  return (
    <SafeAreaView className={`flex-1 ${levelStyle.bg}`} edges={["top"]}>
      <ScrollView
        className="flex-1 bg-cream"
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 130 }}
      >
        <View className={`${levelStyle.bg} px-6 pt-14 pb-12 items-center`}>
          <Text className="font-jakarta-bold text-[24px] text-white text-center mb-2">
            Teknik 5-4-3-2-1
          </Text>
          <Text className="font-jakarta-regular text-[14px] text-white text-center leading-[22px]">
            Fokuskan perhatianmu ke indera-inderamu satu per satu.
          </Text>
          {mission && !isLoading && (
            <View className={`mt-4 px-4 py-1.5 rounded-full ${levelStyle.badge}`}>
              <Text className="font-jakarta-bold text-[13px] text-white">
                Level {mission.level}
              </Text>
            </View>
          )}
        </View>

        <View className="px-6 mt-6">
          {isLoading ? (
            <View className="items-center justify-center py-16">
              <ActivityIndicator size="large" color="#D7385E" />
              <Text className="font-jakarta-regular text-[14px] text-[#999] mt-4">
                Menyiapkan misi hari ini...
              </Text>
            </View>
          ) : mission ? (
            <>
              {SENSE_CONFIG.map(({ key, label, emoji }) => {
                const items = mission.senses[key] ?? [];
                return (
                  <View
                    key={key}
                    className={`mb-4 bg-white border rounded-[16px] overflow-hidden ${levelStyle.border}`}
                  >
                    <View className={`${levelStyle.badge} px-4 py-2.5 flex-row items-center gap-2`}>
                      <Text className="text-[16px]">{emoji}</Text>
                      <Text className="font-jakarta-bold text-[14px] text-white">
                        {label} ({items.length})
                      </Text>
                    </View>

                    <View className="p-4" style={{ gap: 10 }}>
                      {items.map((item, idx) => {
                        const itemKey = `${key}-${idx}`;
                        const isChecked = mission.is_completed || !!checked[itemKey];
                        return (
                          <TouchableOpacity
                            key={itemKey}
                            onPress={() => toggleCheck(itemKey)}
                            activeOpacity={0.7}
                            className="flex-row items-start gap-3"
                          >
                            <View
                              className="w-5 h-5 rounded-[5px] border-2 items-center justify-center mt-[1px] flex-shrink-0"
                              style={{
                                borderColor: isChecked ? levelStyle.check : "#CCCCCC",
                                backgroundColor: isChecked ? levelStyle.check : "transparent",
                              }}
                            >
                              {isChecked && (
                                <Ionicons name="checkmark" size={13} color="white" />
                              )}
                            </View>
                            <Text
                              className="font-jakarta-regular text-[13px] text-black leading-[20px] flex-1"
                              style={{ textDecorationLine: isChecked ? "line-through" : "none", opacity: isChecked ? 0.5 : 1 }}
                            >
                              {item}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}

              <View className="mt-2 mb-2 bg-[#FFF4D6] border border-[#FFD600] rounded-[14px] p-3.5 flex-row items-start">
                <View className="w-5 h-5 rounded-full bg-[#FFB800] items-center justify-center mr-2.5 mt-0.5 flex-shrink-0">
                  <Text className="font-jakarta-bold text-white text-[10px]">!</Text>
                </View>
                <Text className="font-jakarta-regular text-[12px] text-black flex-1 leading-[18px]">
                  <Text className="font-jakarta-bold">Ingat! </Text>
                  Kamu tidak perlu keluar atau memaksakan diri. Lakukan yang kamu mampu dari tempatmu sekarang.
                </Text>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>

      {mission && !isLoading && (
        <View
          className="absolute bottom-0 left-0 right-0 px-6 pt-4 pb-6 bg-cream"
          style={{ borderTopWidth: 1, borderTopColor: "#E5E5E5" }}
        >
          {!mission.is_completed && (
            <Text className="font-jakarta-regular text-[12px] text-[#999] text-center mb-2">
              {checkedCount}/{totalItems} item selesai
            </Text>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleComplete}
            disabled={(!allChecked && !mission.is_completed) || mission.is_completed}
            className="py-3.5 rounded-[14px] items-center justify-center flex-row gap-2"
            style={{
              backgroundColor: mission.is_completed
                ? "#0F8E52"
                : allChecked
                ? levelStyle.check
                : "#CCCCCC",
            }}
          >
            <Text className="font-jakarta-bold text-[16px] text-white">
              {mission.is_completed ? "Misi Hari Ini Selesai ✓" : "Tandai Selesai"}
            </Text>
            {mission.is_completed && <Ionicons name="checkmark-circle" size={20} color="white" />}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
