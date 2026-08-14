import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import CalmButton from "../components/CalmButton";
import Logo from "../components/Logo";

export default function DashboardScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
      <Logo variant="pink" size={80} />
      
      <View className="mt-8 items-center">
        <Text className="font-jakarta-bold text-2xl text-black text-center mb-2">
          Dashboard Kosong
        </Text>
        <Text className="font-rubik-regular text-base text-grey text-center mb-6">
          Selamat datang, {user?.firstName || user?.emailAddresses[0]?.emailAddress || "Pengguna"}!
        </Text>
        
        <View className="bg-white p-4 rounded-card w-full mb-8 shadow-sm">
          <Text className="font-jakarta-bold text-sm text-black mb-2">Data Clerk Metadata:</Text>
          <Text className="font-rubik-regular text-xs text-grey">
            {JSON.stringify(user?.unsafeMetadata, null, 2)}
          </Text>
        </View>

        <CalmButton
          title="Keluar (Sign Out)"
          onPress={handleSignOut}
          variant="outline-pink"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
