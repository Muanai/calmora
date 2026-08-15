import React, { useState, useEffect } from "react";
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
import FormInput from "../../components/FormInput";
import CalmButton from "../../components/CalmButton";
import Logo from "../../components/Logo";
import ProgressBar from "../../components/ProgressBar";
import RadioGroup from "../../components/RadioGroup";
import { useUser } from "@clerk/clerk-expo";

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

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  
  // Step State (2 to 3)
  const [currentStep, setCurrentStep] = useState(2);
  const [agreePolicy, setAgreePolicy] = useState(false);

  // Form Data
  const [nama, setNama] = useState(user?.firstName || "");
  const [umur, setUmur] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [asalDaerah, setAsalDaerah] = useState("");
  const [agama, setAgama] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      if (user.unsafeMetadata?.kondisi) {
        // If profile is already complete, redirect to dashboard
        router.replace("/dashboard");
      } else if (!nama && user.firstName) {
        setNama(user.firstName);
      }
    }
  }, [isLoaded, user]);

  const handleNext = () => {
    if (currentStep === 2) {
      if (!umur || !jenisKelamin || !asalDaerah) {
        alert("Mohon lengkapi semua data wajib (Umur, Jenis Kelamin, Asal Daerah)");
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSave = async () => {
    if (!isLoaded || !user) return;
    if (!kondisi) {
      alert("Mohon pilih kondisi yang paling sering kamu rasakan");
      return;
    }
    
    const hasAgreed = user.unsafeMetadata?.agreedPolicy === true;
    if (!hasAgreed && !agreePolicy) {
      alert("Anda harus menyetujui Kebijakan Privasi");
      return;
    }
    
    setIsLoading(true);

    try {
      await user.update({
        unsafeMetadata: {
          nama,
          umur,
          jenisKelamin,
          asalDaerah,
          agama,
          kondisi,
        },
      });

      router.replace("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan profil");
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

          <View className="flex-1 gap-4">
            {currentStep === 2 && (
              <>
                <FormInput
                  label="Umur"
                  placeholder="Masukkan Umur Kamu"
                  value={umur}
                  onChangeText={(val) => setUmur(val.replace(/[^0-9]/g, ''))}
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
                {user?.unsafeMetadata?.agreedPolicy !== true && (
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
                )}
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View className="mt-8">
            <CalmButton
              title={currentStep === 3 ? "Simpan Profil" : "Lanjut"}
              onPress={currentStep === 3 ? handleSave : handleNext}
              variant="pink"
              fullWidth
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
