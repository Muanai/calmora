import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const ACTIVITIES = [
  {
    id: "technique-54321",
    title: "Teknik 5-4-3-2-1",
    subtitle: "Redakan panik sekarang",
    icon: <Ionicons name="pulse" size={24} color="#D7385E" />,
    bgColor: "bg-pink-light",
    borderColor: "border-pink",
    iconContainer: "bg-transparent",
  },
  {
    id: "daily-mission",
    title: "Misi Hari Ini",
    subtitle: "Pelan pelan tanpa paksaan",
    icon: <Ionicons name="document-text" size={24} color="#FFF" />,
    bgColor: "bg-[#D9EFE6]",
    borderColor: "border-[#009455]",
    iconContainer: "bg-[#009455]",
  },
  {
    id: "ai-consultation",
    title: "Konsultasi AI",
    subtitle: "Ceritakan apapun",
    icon: <MaterialCommunityIcons name="robot" size={28} color="#357BF7" />,
    bgColor: "bg-[#E1EBFE]",
    borderColor: "border-[#357BF7]",
    iconContainer: "bg-transparent",
  },
  {
    id: "write-release",
    title: "Tulis & Lepaskan",
    subtitle: "Tumpahkan perasaan",
    icon: <Ionicons name="pencil" size={24} color="#806DE3" />,
    bgColor: "bg-purple-lighter",
    borderColor: "border-purple",
    iconContainer: "bg-transparent",
  },
];

export default function ActivityGrid() {
  return (
    <View className="px-6 py-6 pb-20">
      <Text className="font-jakarta-bold text-xl text-black mb-4">
        Pilihan Aktivitas
      </Text>
      
      <View className="flex-row flex-wrap justify-between">
        {ACTIVITIES.map((activity) => (
          <TouchableOpacity 
            key={activity.id}
            activeOpacity={0.8}
            className={`w-[47%] ${activity.bgColor} border-2 ${activity.borderColor} rounded-[16px] p-4 mb-4 items-start justify-between min-h-[130px]`}
          >
            <View className={`w-10 h-10 rounded-[10px] items-center justify-center mb-3 ${activity.iconContainer}`}>
              {activity.icon}
            </View>
            <View>
              <Text className="font-jakarta-bold text-sm text-black mb-1">{activity.title}</Text>
              <Text className="font-jakarta-regular text-xs text-black opacity-70">{activity.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
