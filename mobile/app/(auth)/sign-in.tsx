import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CalmButton from "../../components/CalmButton";
import FormInput from "../../components/FormInput";
import Logo from "../../components/Logo";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-pink pt-16 pb-24 px-6 items-center">
          <SafeAreaView edges={["top"]}>
            <Logo variant="white" size={93} />
          </SafeAreaView>

          <View className="mt-6 w-full max-w-[305px]">
            <Text className="font-jakarta-bold text-[32px] leading-[38px] text-white text-center">
              Selamat Datang di Calmora!
            </Text>
            <Text className="font-rubik-regular text-sm text-white text-center mt-2 leading-[21px]">
              Masuk untuk melanjutkan perjalanan bersama Nomi. Tanpa tekanan, kapan saja kamu siap.
            </Text>
          </View>
        </View>

        <View
          className="bg-white flex-1 px-6 pt-12 -mt-12"
          style={{
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          }}
        >
          <View className="gap-3">
            <FormInput
              label="Email"
              placeholder="Masukkan Email Kamu"
              value={email}
              onChangeText={setEmail}
            />
            <FormInput
              label="Kata Sandi"
              placeholder="Masukkan Kata Sandi Kamu"
              isPassword
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity className="self-end">
              <Text className="font-rubik-regular text-sm text-black underline">
                Lupa kata sandi?
              </Text>
            </TouchableOpacity>

            <View className="mt-2">
              <CalmButton
                title="Masuk"
                onPress={() => {}}
                variant="pink"
                fullWidth
              />
            </View>
          </View>

          <View className="mt-6 gap-3 items-center">
            <View className="flex-row items-center w-full gap-3">
              <View className="flex-1 h-px bg-grey" />
              <Text className="font-rubik-regular text-sm text-grey">Atau</Text>
              <View className="flex-1 h-px bg-grey" />
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-center gap-3 border border-grey rounded-btn h-12 w-full"
              activeOpacity={0.7}
            >
              <Ionicons name="logo-google" size={20} color="#999" />
              <Text className="font-jakarta-regular text-base text-grey">
                Lanjutkan dengan Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center gap-3 border border-grey rounded-btn h-12 w-full"
              activeOpacity={0.7}
            >
              <Ionicons name="logo-apple" size={22} color="#000" />
              <Text className="font-jakarta-regular text-base text-grey">
                Lanjutkan dengan Apple
              </Text>
            </TouchableOpacity>

            <View className="flex-row mt-2 mb-8">
              <Text className="font-rubik-regular text-sm text-black">
                Tidak punya akun?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
                <Text className="font-rubik-regular text-sm text-link underline">
                  Daftar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
