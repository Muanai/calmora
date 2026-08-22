import { View, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

// Images
import pfpImg from "../assets/images/pfp.png";

type InputFieldProps = {
  label: string;
  value: string;
  isPassword?: boolean;
};

function InputField({ label, value, isPassword }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View className="w-full mb-3">
      <Text className="font-jakarta-semibold text-[16px] text-black mb-2">{label}</Text>
      <View className={`bg-white border h-[48px] rounded-[16px] flex-row items-center px-4 ${isFocused ? 'border-[#D7385E]' : 'border-[#999]'}`}>
        <TextInput 
          className="flex-1 font-jakarta-regular text-[16px] text-[#999]"
          style={[{ outlineStyle: 'none' } as any]}
          value={value}
          editable={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const userName = (user?.unsafeMetadata?.nama as string) || user?.firstName || user?.fullName?.split(" ")[0] || "User";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-[#FFFDF0]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View 
        className="flex-row items-center px-6 border-b border-[#E5E5E5] bg-[#FFFDF0] z-10"
        style={{ paddingTop: insets.top + 16, paddingBottom: 16 }}
      >
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center mr-2"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        
        <View className="w-10 h-10 bg-[#D7385E] rounded-[10px] items-center justify-center mr-3">
          <Ionicons name="settings-sharp" size={22} color="white" />
        </View>
        
        <Text className="font-jakarta-bold text-[20px] text-black flex-1">Pengaturan</Text>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View className="items-center mb-8">
          <View className="relative w-[114px] h-[114px]">
            <View className="w-[114px] h-[114px] bg-[#67D4FF] rounded-full items-center justify-center overflow-hidden">
              <Image 
                source={pfpImg as any}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity 
              className="absolute right-0 bottom-0 w-10 h-10 bg-[#D7385E] rounded-full items-center justify-center border-[3px] border-[#FFFDF0]"
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <InputField label="Nama" value={userName} />
        <InputField label="Email" value={userEmail} />
        <InputField label="Password" value="********" isPassword={true} />
        
        <TouchableOpacity className="mt-1 self-start">
          <Text className="font-jakarta-regular text-[14px] text-black underline">
            Lupa kata sandi?
          </Text>
        </TouchableOpacity>

        {/* Spacer */}
        <View className="h-12" />

        {/* Login Info */}
        <View className="items-center mb-6">
          <Text className="font-jakarta-regular text-[14px] text-black text-center leading-tight">
            Masuk sebagai{"\n"}{userEmail}
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          className="w-full h-[48px] bg-white border-2 border-[#D7385E] rounded-[16px] items-center justify-center mb-3"
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Text className="font-jakarta-semibold text-[16px] text-[#D7385E]">Simpan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-full h-[48px] bg-[#D7385E] rounded-[16px] items-center justify-center mb-6"
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text className="font-jakarta-semibold text-[16px] text-white">Keluar</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
