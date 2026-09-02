import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import PulseIcon from "../../assets/images/pulse.svg";
import MissionIcon from "../../assets/images/mission.svg";
import RobotIcon from "../../assets/images/robot.svg";
import PencilIcon from "../../assets/images/pencil.svg";
import WindIcon from "../../assets/images/wind.svg";
import MeditationIcon from "../../assets/images/meditation.svg";

const ACTIVITIES = [
  {
    id: "fast-soother",
    route: "/calm",
    title: "Penenang Cepat",
    subtitle: "Panduan napas 1 tap",
    icon: <WindIcon width={40} height={40} />,
    bgColor: "bg-[#ece9fb]",
    borderColor: "border-[#806de3]",
    iconContainer: "bg-[#806DE3]",
  },
  {
    id: "technique-54321",
    route: "/activity",
    title: "Teknik 5-4-3-2-1",
    subtitle: "Redakan panik perlahan",
    icon: <PulseIcon width={24} height={24} />,
    bgColor: "bg-[#f9e1e7]",
    borderColor: "border-[#d7385e]",
    iconContainer: "bg-[#D7385E]",
  },
  {
    id: "meditation",
    route: "/meditation",
    title: "Meditasi",
    subtitle: "Alunan suara penenang",
    icon: <MeditationIcon width={28} height={25} />,
    bgColor: "bg-[#fbebef]",
    borderColor: "border-[#d7385e]",
    iconContainer: "bg-[#D7385E]",
  },
  {
    id: "write-release",
    route: "/journal",
    title: "Tulis & Lepaskan",
    subtitle: "Tumpahkan perasaan",
    icon: <PencilIcon width={22} height={22} />,
    bgColor: "bg-[#f2effb]",
    borderColor: "border-[#806de3]",
    iconContainer: "bg-[#806DE3]",
  },
  {
    id: "ai-consultation",
    route: "/chat",
    title: "Ruang Cerita",
    subtitle: "Ceritakan harimu",
    icon: <RobotIcon width={50} height={50} />,
    bgColor: "bg-[#E1EBFE]",
    borderColor: "border-[#357BF7]",
    iconContainer: "bg-[#357BF7]",
  },
  {
    id: "daily-mission",
    route: "/mission",
    title: "Misi Hari Ini",
    subtitle: "Pelan pelan tanpa paksaan",
    icon: <MissionIcon width={24} height={24} />,
    bgColor: "bg-[#D9EFE6]",
    borderColor: "border-[#009455]",
    iconContainer: "bg-[#009455]",
  },
];

export default function ActivityGrid() {
  const router = useRouter();

  return (
    <View className="px-6 py-6 pb-2">
      <Text className="font-jakarta-bold text-xl text-black mb-4">
        Pilihan Aktivitas
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {ACTIVITIES.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            activeOpacity={0.8}
            onPress={() => activity.route && router.push(activity.route as any)}
            className={`w-[47%] ${activity.bgColor} border-2 ${activity.borderColor} rounded-[16px] px-2 py-4 mb-4 items-center justify-center min-h-[130px]`}
          >
            <View className="w-full px-2 flex-col items-start gap-2">
              <View className={`w-10 h-10 rounded-[10px] items-center justify-center ${activity.iconContainer}`}>
                {activity.icon}
              </View>
              <View className="flex-col gap-1 w-full mt-1">
                <Text className="font-jakarta-bold text-base text-black leading-tight">{activity.title}</Text>
                <Text className="font-jakarta-regular text-xs text-black leading-snug">{activity.subtitle}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
