import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import CalmButton from "../../components/CalmButton";
import FormInput from "../../components/FormInput";
import ProgressBar from "../../components/ProgressBar";
import Logo from "../../components/Logo";
import SocialLoginOptions from "../../components/SocialLoginOptions";
import PrivacyModal from "../../components/PrivacyModal";
import { useSignUp, useUser, useClerk } from "@clerk/expo";

export default function SignUpScreen() {
  const router = useRouter();
  // @ts-ignore - Clerk Expo v4 discriminated union - signUp exists when clerk.loaded
  const { signUp } = useSignUp() as any;
  const { user, isLoaded: userLoaded } = useUser();
  const clerk = useClerk();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [isPolicyVisible, setIsPolicyVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isLoading) return;
    if (userLoaded && user) {
      if (user.unsafeMetadata?.kondisi) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/complete-profile");
      }
    }
  }, [userLoaded, user, isLoading]);

  const handleRegister = async () => {
    if (!clerk.loaded || !signUp) {
      alert("Sistem autentikasi belum siap. Coba refresh halaman.");
      return;
    }
    
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
      console.log("[SignUp] Calling signUp.create()...");
      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: { nama, agreedPolicy: true },
      });
      console.log("[SignUp] create() done. signUp.status:", signUp.status, "signUp.id:", signUp.id);

      // Clerk v4: signUp.create() mutates signUp in-place — baca status langsung dari signUp
      let finalStatus = signUp.status;

      // Jika status masih undefined/null (bisa terjadi saat CAPTCHA error 600010),
      // coba reload untuk mendapatkan state terbaru dari server
      if (!finalStatus) {
        try {
          console.log("[SignUp] Status undefined, reloading...");
          await (signUp as any).reload();
          finalStatus = (signUp as any).status;
          console.log("[SignUp] After reload, status:", finalStatus);
        } catch (_) {}
      }

      if (finalStatus === "complete") {
        await clerk.setActive({ session: signUp.createdSessionId });
        router.replace("/(auth)/complete-profile");
      } else if (finalStatus === "missing_requirements") {
        alert("Pendaftaran berhasil, tetapi memerlukan verifikasi email. Nonaktifkan email verification di Clerk Dashboard untuk mode dev.");
      } else if (signUp.id) {
        console.warn("Sign-up incomplete, id:", signUp.id, "status:", finalStatus);
        router.replace("/(auth)/complete-profile");
      } else {
        alert("Terjadi masalah pada proses pendaftaran. Pastikan Bot Protection di Clerk Dashboard dinonaktifkan untuk dev.");
      }
    } catch (err: any) {
      const keys = err ? Object.getOwnPropertyNames(err) : [];
      const errDetail: any = {};
      keys.forEach((k) => { try { errDetail[k] = err[k]; } catch (_) {} });
      console.error("[SignUp] Error detail:", errDetail);
      console.error("[SignUp] err.errors:", err?.errors);
      const clerkMsg = err?.errors?.[0]?.message;
      alert(clerkMsg || err?.message || "Terjadi kesalahan saat mendaftar");
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
              isRequired
            />
            <FormInput
              label="Email"
              placeholder="Masukkan Email Kamu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              isRequired
            />
            <View>
              <FormInput
                label="Kata Sandi"
                placeholder="Masukkan Kata Sandi Kamu"
                isPassword
                value={password}
                onChangeText={setPassword}
                isRequired
              />
              <Text className="text-gray-400 text-xs mt-1 ml-1 font-rubik-regular">
                Minimal 8 karakter dan tidak mudah ditebak
              </Text>
            </View>
            
            <FormInput
              label="Kode Referal"
              placeholder="Masukkan Kode Referal (Opsional)"
              value={referralCode}
              onChangeText={setReferralCode}
            />
            
              <View className="flex-row items-center mt-2 flex-wrap">
                <TouchableOpacity
                  className="flex-row items-center gap-3 mr-1"
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
                    Saya Setuju Dengan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsPolicyVisible(true)}>
                  <Text className="font-jakarta-bold text-[14px] text-pink underline">
                    Kebijakan Privasi
                  </Text>
                </TouchableOpacity>
              </View>
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
        </View>
      </ScrollView>
      {/* Clerk CAPTCHA - di luar ScrollView agar iframe Turnstile bisa diklik */}
      <View nativeID="clerk-captcha" />

      <PrivacyModal
        visible={isPolicyVisible}
        onClose={() => setIsPolicyVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}
