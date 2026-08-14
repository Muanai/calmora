import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SocialLoginOptionsProps {
  onLoginPress?: () => void;
  isLogin?: boolean;
}

export default function SocialLoginOptions({
  onLoginPress,
  isLogin = false,
}: SocialLoginOptionsProps) {
  return (
    <View className="mt-6 gap-6 items-center">
      <View className="flex-row items-center w-full gap-3">
        <View className="flex-1 h-[1px] bg-grey" />
        <Text className="font-rubik-regular text-sm text-grey">
          Atau masuk menggunakan
        </Text>
        <View className="flex-1 h-[1px] bg-grey" />
      </View>

      <View className="flex-row items-center justify-between w-full gap-4">
        <TouchableOpacity
          className="flex-1 h-[48px] bg-pink-light rounded-btn items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="logo-google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-[48px] bg-pink-light rounded-btn items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="logo-apple" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-[48px] bg-pink-light rounded-btn items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="logo-facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center">
        <Text className="font-rubik-regular text-sm text-grey">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        </Text>
        <TouchableOpacity onPress={onLoginPress}>
          <Text className="font-rubik-regular text-sm text-link underline">
            {isLogin ? "Daftar" : "Masuk"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
