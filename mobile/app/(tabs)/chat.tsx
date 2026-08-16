import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#FBEBEF] items-center justify-center px-6">
      <Text className="font-jakarta-bold text-2xl text-black">Halaman Chat AI</Text>
      <Text className="font-jakarta-regular text-sm text-gray-500 mt-2">Segera Datang</Text>
    </SafeAreaView>
  );
}
