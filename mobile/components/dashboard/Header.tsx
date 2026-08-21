import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";

export default function Header() {
  const { user } = useUser();
  const userName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "Pengguna";

  return (
    <View className="flex-row items-center justify-between px-6 pt-12 pb-4 z-10">
      <View className="flex-row items-center gap-3">
        {/* Profile Picture Placeholder */}
        <View className="w-14 h-14 rounded-2xl bg-gray-300 overflow-hidden">
          {user?.imageUrl && <Image source={{ uri: user.imageUrl }} className="w-full h-full" />}
        </View>
        <View>
          <Text className="font-jakarta-regular text-sm text-black">Halo👋</Text>
          <Text className="font-jakarta-bold text-xl text-black">{userName}</Text>
        </View>
      </View>
      <TouchableOpacity className="w-[46px] h-[47px] bg-white rounded-full items-center justify-center shadow-sm">
        <Ionicons name="notifications" size={24} color="#D7385E" />
      </TouchableOpacity>
    </View>
  );
}
