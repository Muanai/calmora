import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// SVG Icons
import GearIcon from "../../assets/images/gear.svg";
import CoinIcon from "../../assets/images/coin.svg";
import PulseIcon from "../../assets/images/pulse.svg";
import MissionIcon from "../../assets/images/mission.svg";
import PencilIcon from "../../assets/images/pencil.svg";
import LockIcon from "../../assets/images/lock.svg";

// Images
import mascotHappyImg from "../../assets/images/mascot-happy.png";

type ProfileCardProps = {
  title: string;
  subtitle: string;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  icon: React.ReactNode;
  hasChevron?: boolean;
  chevronColor?: string;
  onPress?: () => void;
};

function ProfileCard({ title, subtitle, bgColor, borderColor, iconBgColor, icon, hasChevron, chevronColor, onPress }: ProfileCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      className={`border ${borderColor} ${bgColor} rounded-[16px] p-4 flex-row items-center justify-between mb-3 shadow-sm`}
    >
      <View className="flex-row items-center flex-1">
        <View className={`${iconBgColor} w-[34px] h-[34px] rounded-[10px] items-center justify-center mr-3`}>
          {icon}
        </View>
        <View className="flex-1 pr-2">
          <Text className="font-jakarta-semibold text-[16px] text-black leading-tight mb-1">{title}</Text>
          <Text className="font-jakarta-regular text-[12px] text-black leading-tight">{subtitle}</Text>
        </View>
      </View>
      {hasChevron && (
        <View className={`w-7 h-7 rounded-full ${chevronColor || 'bg-black'} items-center justify-center`}>
          <Ionicons name="play" size={14} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const userName = user?.firstName || user?.fullName?.split(" ")[0] || "Rasya Fariz";

  return (
    <View className="flex-1 bg-[#FFFDF0]">
      {/* Background Header Decoration - Simple fallback since we don't have the wavy SVGs */}
      <View className="absolute top-0 left-0 right-0 h-[250px] bg-pink rounded-b-[100px] opacity-20" />
      <View className="absolute top-[-50px] left-[-50px] right-[-50px] h-[250px] bg-pink rounded-b-[200px] opacity-40" />
      <View className="absolute top-[-100px] left-[-100px] right-[-100px] h-[250px] bg-pink rounded-b-[300px] opacity-60" />

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Settings Button */}
        <View className="items-end px-6 pt-4">
          <TouchableOpacity 
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
            onPress={handleLogout} // Temporary hook for logout
          >
            <GearIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Profile Info */}
          <View className="items-center mt-2 mb-8">
            <View className="w-[114px] h-[114px] bg-white rounded-full items-center justify-center border-4 border-white shadow-sm mb-4">
              <Image 
                source={{ uri: user?.imageUrl }} 
                defaultSource={mascotHappyImg as any}
                style={{ width: 106, height: 106, borderRadius: 53 }}
                resizeMode="cover"
              />
            </View>
            <Text className="font-jakarta-bold text-[24px] text-black text-center">{userName}</Text>
            <Text className="font-jakarta-regular text-[14px] text-black text-center mb-4">Bergabung pada Agustus 2026</Text>
            
            <TouchableOpacity className="bg-[#D7385E] rounded-[16px] px-6 py-3 flex-row items-center">
              <CoinIcon width={24} height={24} style={{ marginRight: 8 }} />
              <Text className="font-jakarta-bold text-[20px] text-white">50 Koin</Text>
            </TouchableOpacity>
          </View>

          {/* Perjalanan Tenangmu Section */}
          <Text className="font-jakarta-bold text-[20px] text-black mb-3">Perjalanan Tenangmu</Text>
          
          <ProfileCard
            title="Aktivitas"
            subtitle="20 kali berhasil menenangkan diri"
            bgColor="bg-[#FBEBEF]"
            borderColor="border-[#D7385E]"
            iconBgColor="bg-transparent"
            icon={<PulseIcon width={34} height={34} />}
          />

          <ProfileCard
            title="Misi"
            subtitle="2 langkah kecil terselesaikan"
            bgColor="bg-[#E6F4EE]"
            borderColor="border-[#009455]"
            iconBgColor="bg-[#009455]"
            icon={<MissionIcon width={20} height={20} />}
          />

          <ProfileCard
            title="Jurnal"
            subtitle="2 beban pikiran berhasil dilepaskan"
            bgColor="bg-[#F2F0FC]"
            borderColor="border-[#806DE3]"
            iconBgColor="bg-transparent"
            icon={<PencilIcon width={34} height={34} />}
          />

          {/* Langganan Section */}
          <Text className="font-jakarta-bold text-[20px] text-black mt-4 mb-3">Langganan</Text>
          
          <ProfileCard
            title="Paket Pahlawan"
            subtitle="Bantu subsidi akses untuk sesama pengguna"
            bgColor="bg-[#EBF2FE]"
            borderColor="border-[#357BF7]"
            iconBgColor="bg-transparent"
            icon={<Ionicons name="albums" size={24} color="#357BF7" />} // Fallback icon
            hasChevron={true}
            chevronColor="bg-[#357BF7]"
          />

          {/* Kebijakan Privasi Section */}
          <Text className="font-jakarta-bold text-[20px] text-black mt-4 mb-3">Kebijakan Privasi</Text>
          
          <ProfileCard
            title="Keamanan & Privasi Cerita"
            subtitle="100% rahasia & terenkripsi"
            bgColor="bg-[#FBEBEF]"
            borderColor="border-[#D7385E]"
            iconBgColor="bg-transparent"
            icon={<LockIcon width={34} height={34} />}
            hasChevron={true}
            chevronColor="bg-[#D7385E]"
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
