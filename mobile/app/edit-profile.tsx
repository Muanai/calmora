import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type InputFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
};

function InputField({ label, value, placeholder, onChangeText }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  
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
        />
      </View>
    </View>
  );
}

function RadioOption({ label, selected, onPress }: { label: string, selected: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity 
      className="flex-row items-center py-[7px]" 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className={`w-[16px] h-[16px] rounded-full border items-center justify-center mr-[12px] ${selected ? 'border-[#D7385E]' : 'border-[#999]'}`}>
        {selected && <View className="w-[10px] h-[10px] rounded-full bg-[#D7385E]" />}
      </View>
      <Text className="font-jakarta-regular text-[16px] text-black whitespace-nowrap">{label}</Text>
    </TouchableOpacity>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [umur, setUmur] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [daerah, setDaerah] = useState("");
  const [agama, setAgama] = useState("");
  const [kondisi, setKondisi] = useState("");

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
          <Ionicons name="settings-sharp" size={22} color="white" />
        </View>
        
        <Text className="font-jakarta-bold text-[20px] text-black flex-1">Pengaturan Data Diri</Text>
      </View>

      {/* Divider */}
      <View className="mx-6 h-[1px] bg-[#E5E5E5]" />

      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 16, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <InputField 
          label="Umur" 
          value={umur} 
          placeholder="20 Tahun" 
          onChangeText={setUmur} 
        />

        <View className="w-full mb-4">
          <Text className="font-jakarta-semibold text-[16px] text-black mb-2">Jenis Kelamin</Text>
          <View className="bg-white border border-[#999] rounded-[16px] px-4 py-3">
            <RadioOption label="Laki - Laki" selected={jenisKelamin === "Laki - Laki"} onPress={() => setJenisKelamin("Laki - Laki")} />
            <RadioOption label="Perempuan" selected={jenisKelamin === "Perempuan"} onPress={() => setJenisKelamin("Perempuan")} />
          </View>
        </View>

        <InputField 
          label="Asal Daerah" 
          value={daerah} 
          placeholder="Kota Malang, Jawa Timur" 
          onChangeText={setDaerah} 
        />

        <InputField 
          label="Agama" 
          value={agama} 
          placeholder="Islam" 
          onChangeText={setAgama} 
        />

        <View className="w-full mb-4">
          <Text className="font-jakarta-semibold text-[16px] text-black mb-2">Kondisi Apa Yang Paling Sering Kamu Rasakan?</Text>
          <View className="bg-white border border-[#999] rounded-[16px] px-4 py-3">
            {["Panic Attack", "Severe Anxiety", "Social Anxiety", "Agoraphobia", "Lainnya"].map((item) => (
              <RadioOption 
                key={item} 
                label={item} 
                selected={kondisi === item} 
                onPress={() => setKondisi(item)} 
              />
            ))}
          </View>
        </View>

        {/* Spacer */}
        <View className="flex-1 min-h-[32px]" />

        {/* Action Buttons */}
        <TouchableOpacity 
          className="w-full h-[48px] bg-white border-2 border-[#D7385E] rounded-[16px] items-center justify-center mb-3"
          activeOpacity={0.8}
          onPress={handleGoBack}
        >
          <Text className="font-jakarta-semibold text-[16px] text-[#D7385E]">Simpan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-full h-[48px] bg-[#D7385E] rounded-[16px] items-center justify-center"
          activeOpacity={0.8}
          onPress={handleGoBack}
        >
          <Text className="font-jakarta-semibold text-[16px] text-white">Keluar</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
