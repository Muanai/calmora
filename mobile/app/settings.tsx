import { View, Text, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import pfpImg from "../assets/images/pfp.png";

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
};

function InputField({ label, value, onChangeText, editable = true }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View className="w-full mb-3">
      <Text className="font-jakarta-semibold text-[16px] text-black mb-2">{label}</Text>
      <View className={`bg-white border h-[48px] rounded-[16px] flex-row items-center px-4 ${isFocused ? 'border-[#D7385E]' : 'border-[#999]'}`}>
        <TextInput 
          className={`flex-1 font-jakarta-regular text-[16px] ${editable ? 'text-black' : 'text-[#999]'}`}
          style={[{ outlineStyle: 'none' } as any]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const initialName = (user?.unsafeMetadata?.nama as string) || user?.firstName || user?.fullName?.split(" ")[0] || "";
  const initialEmail = user?.primaryEmailAddress?.emailAddress || "";
  
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/profile");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await user.update({
        firstName: name
      });
      await user.updateMetadata({
        unsafeMetadata: { nama: name }
      });
      
      if (email !== initialEmail) {
        Alert.alert("Info", "Untuk mengubah email, silakan gunakan fitur pengelolaan akun Clerk.");
        setEmail(initialEmail); // Revert for now
      } else {
        Alert.alert("Berhasil", "Profil berhasil diperbarui!");
      }
    } catch (e: any) {
      Alert.alert("Gagal", e.message || "Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsSaving(false);
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
          <Ionicons name="settings-sharp" size={22} color="white" />
        </View>
        
        <Text className="font-jakarta-bold text-[20px] text-black flex-1">Pengaturan Profil</Text>
      </View>

      {/* Divider */}
      <View className="mx-6 h-[1px] bg-[#E5E5E5]" />

      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 16, paddingTop: 32 }}
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
        <InputField label="Nama" value={name} onChangeText={setName} />
        <InputField label="Email" value={initialEmail} editable={false} />

        {/* Password field without eye icon - it's read-only so show/hide is irrelevant */}
        <View className="w-full mb-3">
          <Text className="font-jakarta-semibold text-[16px] text-black mb-2">Password</Text>
          <View className="bg-white border border-[#999] h-[48px] rounded-[16px] flex-row items-center px-4">
            <Text className="flex-1 font-jakarta-regular text-[16px] text-[#999]">••••••••</Text>
          </View>
        </View>

        <TouchableOpacity 
          className="mt-1 self-start"
          onPress={() => router.push("/edit-password")}
        >
          <Text className="font-jakarta-regular text-[14px] text-black underline">
            Lupa kata sandi?
          </Text>
        </TouchableOpacity>

        {/* Spacer */}
        <View className="flex-1 min-h-[48px]" />

        {/* Login Info */}
        <View className="items-center mb-6">
          <Text className="font-jakarta-regular text-[14px] text-black text-center leading-tight">
            Masuk sebagai{"\n"}{initialEmail}
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity 
          className="w-full h-[48px] bg-white border-2 border-[#D7385E] rounded-[16px] items-center justify-center mb-3"
          activeOpacity={0.8}
          onPress={() => router.push("/edit-profile")}
        >
          <Text className="font-jakarta-semibold text-[16px] text-[#D7385E]">Edit Data Diri</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-full h-[48px] bg-[#D7385E] rounded-[16px] items-center justify-center"
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="font-jakarta-semibold text-[16px] text-white">Simpan</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
