import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FBEBEF] items-center justify-center px-6">
      <Text className="font-jakarta-bold text-2xl text-black">Halaman Profil</Text>
      <Text className="font-jakarta-regular text-sm text-gray-500 mt-2 mb-8">Segera Datang</Text>

      <TouchableOpacity 
        onPress={handleLogout}
        className="bg-[#D7385E] px-8 py-3 rounded-[16px] shadow-sm"
        activeOpacity={0.8}
      >
        <Text className="font-jakarta-bold text-white text-[16px]">Logout (Debug)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
