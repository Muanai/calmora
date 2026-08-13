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
import CalmButton from "../../components/CalmButton";
import FormInput from "../../components/FormInput";
import Logo from "../../components/Logo";

export default function SignUpScreen() {
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

          <View className="mt-6 w-full">
            <Text className="font-jakarta-bold text-[32px] leading-[38px] text-white text-center">
              Yuk Mulai Perjalananmu!
            </Text>
            <Text className="font-rubik-regular text-sm text-white text-center mt-2 leading-[21px]">
              Buat ruang pribadi khusus untuk kamu. Cerita dan privasimu terjaga penuh 100% di sini.
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
          <View className="gap-4">
            <FormInput
              label="Email"
              placeholder="Masukkan Email Kamu"
              isPassword
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

            <View className="mt-2">
              <CalmButton
                title="Daftar"
                onPress={() => {}}
                variant="pink"
                fullWidth
              />
            </View>
          </View>

          <View className="mt-8 items-center mb-8">
            <View className="flex-row">
              <Text className="font-rubik-regular text-sm text-black">
                Sudah punya akun?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
                <Text className="font-rubik-regular text-sm text-link underline">
                  Masuk
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
