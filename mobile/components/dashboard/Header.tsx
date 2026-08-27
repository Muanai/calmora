import { View, Text, TouchableOpacity, Image } from "react-native";
import BellIcon from "../../assets/images/bell.svg";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";

export default function Header() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const userName = isLoaded
    ? (user?.unsafeMetadata?.nama as string) || user?.firstName || user?.fullName?.split(" ")[0] || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "Pengguna"
    : "...";

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
      <TouchableOpacity 
        onPress={() => router.push('/notifications')}
        className="w-[46px] h-[47px] bg-white rounded-2xl items-center justify-center shadow-sm border border-gray-100"
      >
        <View className="relative">
          <BellIcon width={24} height={24} />
          <View className="absolute top-0 right-0 w-[11px] h-[11px] bg-[#D7385E] rounded-full border-2 border-white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
