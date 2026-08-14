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
import ProgressBar from "../../components/ProgressBar";
import RadioGroup from "../../components/RadioGroup";
import SocialLoginOptions from "../../components/SocialLoginOptions";

const GENDER_OPTIONS = [
  { label: "Laki - Laki", value: "male" },
  { label: "Perempuan", value: "female" },
];

const DIAGNOSIS_OPTIONS = [
  { label: "Panic Attack", value: "panic_attack" },
  { label: "Severe Anxiety", value: "severe_anxiety" },
  { label: "Social Anxiety", value: "social_anxiety" },
  { label: "Agoraphobia", value: "agoraphobia" },
  { label: "Lainnya", value: "other" },
];

import { useSignUp } from "@clerk/clerk-expo";

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  
  // Step State (0 to 3)
  const [currentStep, setCurrentStep] = useState(0);

  // Form Data
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [umur, setUmur] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [asalDaerah, setAsalDaerah] = useState("");
  const [agama, setAgama] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRegister = async () => {
    if (!isLoaded) return;
    if (!agreePolicy) {
      alert("Anda harus menyetujui Kebijakan Privasi");
      return;
    }
    
    setIsLoading(true);

    try {
      // 1. Create the user in Clerk and pass custom metadata
      const result = await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          nama,
          umur,
          jenisKelamin,
          asalDaerah,
          agama,
          kondisi,
        },
      });

      // 2. Since we skip email verification for MVP, check if complete
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/calm"); // Navigate to post-login
      } else {
        // If Clerk requires email verification (not disabled), it will land here
        console.log("Registration requires further verification (e.g. email OTP).", result.status);
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
          {currentStep > 0 && (
            <View className="mb-6">
              <ProgressBar step={currentStep} totalSteps={3} />
            </View>
          )}

          {/* Step Content */}
          <View className="gap-4">
            {(currentStep === 0 || currentStep === 1) && (
              <>
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
                <FormInput
                  label="Kata Sandi"
                  placeholder="Masukkan Kata Sandi Kamu"
                  isPassword
                  value={password}
                  onChangeText={setPassword}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <FormInput
                  label="Umur"
                  placeholder="Masukkan Umur Kamu"
                  value={umur}
                  onChangeText={setUmur}
                  keyboardType="number-pad"
                />
                <RadioGroup
                  label="Jenis Kelamin"
                  options={GENDER_OPTIONS}
                  value={jenisKelamin}
                  onChange={setJenisKelamin}
                />
                <FormInput
                  label="Asal Daerah"
                  placeholder="Masukkan Asal Daerah Kamu"
                  value={asalDaerah}
                  onChangeText={setAsalDaerah}
                />
                <FormInput
                  label="Agama (Opsional)"
                  placeholder="Masukkan Agama Kamu"
                  value={agama}
                  onChangeText={setAgama}
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                <RadioGroup
                  label="Kondisi Apa Yang Paling Sering Kamu Rasakan?"
                  options={DIAGNOSIS_OPTIONS}
                  value={kondisi}
                  onChange={setKondisi}
                />
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
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View className="mt-8">
            <CalmButton
              title={currentStep === 3 ? "Daftar" : "Lanjut"}
              onPress={currentStep === 3 ? handleRegister : handleNext}
              variant="pink"
              fullWidth
            />
          </View>

          {/* Social Login Options */}
          <SocialLoginOptions
            isLogin={false}
            onLoginPress={() => router.push("/(auth)/sign-in")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
