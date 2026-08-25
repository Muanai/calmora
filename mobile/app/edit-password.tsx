import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import mascotLock from "../assets/images/mascot-lock.png";

type PasswordFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
};

function PasswordField({ label, value, placeholder, onChangeText }: PasswordFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <View className="w-full mb-4">
      <Text className="font-jakarta-semibold text-[16px] text-black mb-2">{label}</Text>
      <View className={`bg-white border h-[48px] rounded-[16px] flex-row items-center px-4 ${isFocused ? 'border-[#D7385E]' : 'border-[#999]'}`}>
        <TextInput 
          className="flex-1 font-jakarta-regular text-[16px] text-black"
          style={[{ outlineStyle: 'none' } as any]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function EditPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/settings");
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-[#FFFDF0]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View 
        className="flex-row items-center px-6 bg-[#FFFDF0] z-10"
        style={{ paddingTop: insets.top + 16, paddingBottom: 16 }}
      >
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center mr-2"
          onPress={handleGoBack}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        
        <View className="w-10 h-10 bg-[#D7385E] rounded-[10px] items-center justify-center mr-3">
          <Ionicons name="lock-closed" size={22} color="white" />
        </View>
        
        <Text className="font-jakarta-bold text-[20px] text-black flex-1">Ubah Kata Sandi</Text>
      </View>

      {/* Divider */}
      <View className="mx-6 h-[1px] bg-[#E5E5E5]" />

      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 16, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <PasswordField 
          label="Kata Sandi Baru" 
          value={password} 
          placeholder="Masukkan kata sandi baru" 
          onChangeText={setPassword} 
        />
        
        <PasswordField 
          label="Konfirmasi Kata Sandi" 
          value={confirmPassword} 
          placeholder="Konfirmasi kata sandi baru" 
          onChangeText={setConfirmPassword} 
        />

        {/* Mascot */}
        <View className="flex-1 justify-center items-center py-8">
          <Image 
            source={mascotLock as any}
            style={{ width: 220, height: 247 }}
            resizeMode="contain"
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          className="w-full h-[48px] bg-[#D7385E] rounded-[16px] items-center justify-center mt-auto"
          activeOpacity={0.8}
          onPress={handleGoBack}
        >
          <Text className="font-jakarta-semibold text-[16px] text-white">Simpan</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
