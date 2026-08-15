import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import CalmButton from "../../components/CalmButton";
import FormInput from "../../components/FormInput";
import ProgressBar from "../../components/ProgressBar";
import Logo from "../../components/Logo";
import SocialLoginOptions from "../../components/SocialLoginOptions";
import { useSignUp, useUser } from "@clerk/clerk-expo";

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user, isLoaded: userLoaded } = useUser();
  
  React.useEffect(() => {
    if (userLoaded && user) {
      if (user.unsafeMetadata?.kondisi) {
        router.replace("/dashboard");
      } else {
        router.replace("/(auth)/complete-profile");
      }
    }
  }, [userLoaded, user]);

  // Form Data
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!isLoaded) return;
    
    if (!nama || !email || !password) {
      alert("Mohon lengkapi Nama, Email, dan Kata Sandi");
      return;
    }
    
    if (password.length < 8) {
      alert("Kata sandi harus terdiri dari minimal 8 karakter");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Format email tidak valid");
      return;
    }

    if (!agreePolicy) {
      alert("Anda harus menyetujui Kebijakan Privasi");
      return;
    }
    
    setIsLoading(true);

    try {
      // Create the user in Clerk and pass nama and agreedPolicy in metadata
      const result = await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: { nama, agreedPolicy: true },
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(auth)/complete-profile"); // Go to complete profile
      } else {
        console.log("Registration requires further verification", result.status);
        alert("Pendaftaran berhasil, tetapi memerlukan verifikasi email. Pastikan setting Clerk mengizinkan bypass email verification untuk MVP.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert(err.errors?.[0]?.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setIsLoading(false);
    }
  };

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
          className="bg-white flex-1 px-6 pt-12 pb-10 -mt-12"
          style={{
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          }}
        >
          {/* Progress Bar (Visible on steps 1, 2, 3) */}
          <View className="mb-6">
            <ProgressBar step={1} totalSteps={3} />
          </View>

          {/* Step Content */}
          <View className="gap-4">
            <FormInput
              label="Nama"
              placeholder="Masukkan Nama Kamu"
              value={nama}
              onChangeText={setNama}
            />
            <FormInput
              label="Email"
              placeholder="Masukkan Email Kamu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <View>
              <FormInput
                label="Kata Sandi"
                placeholder="Masukkan Kata Sandi Kamu"
                isPassword
                value={password}
                onChangeText={setPassword}
              />
              <Text className="text-gray-400 text-xs mt-1 ml-1 font-rubik-regular">
                Minimal 8 karakter dan tidak mudah ditebak
              </Text>
            </View>
            
            <TouchableOpacity
              className="flex-row items-center gap-3 mt-2"
              activeOpacity={0.7}
              onPress={() => setAgreePolicy(!agreePolicy)}
            >
              <View
                className={`w-5 h-5 border rounded items-center justify-center ${
                  agreePolicy ? "border-pink bg-pink" : "border-[#999]"
                }`}
              >
                {agreePolicy && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text className="font-jakarta-regular text-[14px] text-black">
                Saya Setuju Dengan Kebijakan Privasi
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="mt-8">
            <CalmButton
              title="Daftar"
              onPress={handleRegister}
              variant="pink"
              fullWidth
              isLoading={isLoading}
            />
          </View>

          {/* Social Login Options */}
          <SocialLoginOptions
            isLogin={false}
            onLoginPress={() => router.push("/(auth)/sign-in")}
            onLoadingChange={setIsLoading}
          />
          {/* Clerk CAPTCHA container with explicit minHeight to ensure Cloudflare widget renders properly */}
          <View nativeID="clerk-captcha" style={{ minHeight: 100, width: '100%', marginTop: 20 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
