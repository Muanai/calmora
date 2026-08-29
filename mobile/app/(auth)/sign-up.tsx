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

      <Modal
        visible={isPolicyVisible}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4 py-12">
          <View className="bg-white rounded-[24px] w-full max-h-full overflow-hidden relative">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-[#E5E5E5]">
              <Text className="font-jakarta-bold text-[16px] text-black">Kebijakan Privasi (MVP)</Text>
              <TouchableOpacity onPress={() => setIsPolicyVisible(false)} className="p-1">
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
              <Text className="font-jakarta-bold text-[18px] text-black mb-2">Kebijakan Privasi & Ketentuan Layanan (Calmora MVP)</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-4 leading-6">Selamat datang di Calmora. Kami sangat menghargai keputusan Anda untuk menggunakan aplikasi ini sebagai ruang aman mandiri Anda. Kebijakan Privasi dan Ketentuan Layanan ini dirancang khusus untuk versi Minimum Viable Product (MVP) Calmora guna memastikan Anda memahami bagaimana data Anda diproses dengan aman, berempati, dan penuh rasa hormat terhadap privasi Anda.</Text>

              <Text className="font-jakarta-bold text-[16px] text-black mt-2 mb-1">1. PENYANGKALAN MEDIS (MEDICAL DISCLAIMER)</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-1 leading-6">• <Text className="font-jakarta-bold">Bukan Layanan Medis Darurat:</Text> Calmora adalah aplikasi asisten mandiri yang berfungsi sebagai Pertolongan Pertama Psikologis (P3K) dan alat bantu penenang (grounding companion). Calmora TIDAK menyediakan diagnosis medis, terapi klinis, resep obat-obatan, maupun layanan darurat psikiatri.</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-4 leading-6">• <Text className="font-jakarta-bold">Batas Tanggung Jawab:</Text> Jika Anda mengalami krisis kesehatan mental yang membahayakan diri sendiri atau orang lain, Anda sangat disarankan untuk segera menghubungi layanan darurat medis resmi (seperti SEJIWA 129 atau 119) atau menemui tenaga profesional medis terdekat secara langsung.</Text>

              <Text className="font-jakarta-bold text-[16px] text-black mt-2 mb-1">2. PENGUMPULAN & PENGOLAHAN DATA PRIBADI</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-1 leading-6">Calmora dirancang dengan prinsip meminimalkan pengumpulan data (data minimization). Data yang kami kumpulkan hanya bertujuan untuk personalisasi pemulihan Anda:</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-1 leading-6">• <Text className="font-jakarta-bold">Data Akun:</Text> Kami menggunakan layanan pihak ketiga yang aman (Clerk) untuk mengelola proses pendaftaran dan masuk (login) akun Anda.</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-1 leading-6">• <Text className="font-jakarta-bold">Data Jurnal Kecemasan:</Text> Setiap teks cerita atau curhatan yang Anda tulis di Jurnal Kecemasan akan diproses secara aman untuk diekstrak parameternya (seperti tingkat kecemasan dan faktor pemicu) menggunakan kecerdasan buatan (Google Gemini API). Data ini hanya digunakan untuk mengkalibrasi tingkat kesulitan Misi Langkah Mikro Anda secara otomatis di backend.</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-4 leading-6">• <Text className="font-jakarta-bold">Tidak Ada Penjualan Data:</Text> Kami berkomitmen 100% untuk tidak pernah menjual, menyewakan, atau membagikan data jurnal pribadi maupun riwayat emosi Anda kepada pihak ketiga mana pun untuk tujuan periklanan atau pemasaran.</Text>

              <Text className="font-jakarta-bold text-[16px] text-black mt-2 mb-1">3. KONTROL PRIVASI MUTLAK: FITUR "BURN BUTTON"</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-1 leading-6">Kami sangat memahami bahwa data kesehatan mental adalah hal yang sangat sensitif. Oleh karena itu, Anda memegang kendali penuh atas data Anda sendiri:</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-1 leading-6">• <Text className="font-jakarta-bold">Penghapusan Permanen:</Text> Melalui fitur "Hapus Ingatan" (Burn Button) di dalam menu pengaturan aplikasi, Anda dapat menghapus seluruh riwayat pengisian jurnal kecemasan, histori emosi, dan analisis backend Anda secara instan.</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-4 leading-6">• <Text className="font-jakarta-bold">Sifat Penghapusan:</Text> Penghapusan ini bersifat hard-delete permanen pada database kami (PostgreSQL) dan tidak dapat dipulihkan kembali oleh sistem.</Text>

              <Text className="font-jakarta-bold text-[16px] text-black mt-2 mb-1">4. SISTEM POIN BAYANGAN & DOMPET SIMULASI</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-1 leading-6">• <Text className="font-jakarta-bold">Shadow Point (Backend Only):</Text> Untuk menjaga kenyamanan psikologis Anda dari jebakan kecemasan baru (streak trap atau FOMO), angka poin keaktifan Anda tidak akan pernah ditampilkan pada antarmuka aplikasi. Poin direkam secara diam-diam di backend hanya untuk menentukan kelayakan Anda masuk ke dalam antrean penerima donasi akun premium gratis (Pay-It-Forward).</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-4 leading-6">• <Text className="font-jakarta-bold">Dompet Simulasi (Dummy Wallet):</Text> Saldo yang tertera pada menu dompet virtual dalam aplikasi adalah saldo pura-pura (dummy/simulasi). Tidak ada transaksi keuangan riil atau integrasi gerbang pembayaran (payment gateway) asli pada fase MVP ini. Seluruh simulasi transaksi murni dilakukan di atas database internal untuk tujuan demonstrasi sistem.</Text>

              <Text className="font-jakarta-bold text-[16px] text-black mt-2 mb-1">5. PENGGUNAAN KECERDASAN BUATAN (AI SAFEGUARDS)</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-1 leading-6">• <Text className="font-jakarta-bold">S.O.S AI Companion:</Text> Obrolan Anda dengan AI Companion dienkripsi dan dipandu menggunakan basis pengetahuan psikologi tepercaya (Retrieval-Augmented Generation).</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-4 leading-6">• <Text className="font-jakarta-bold">Mitigasi Resiko:</Text> AI dapat melakukan kesalahan interpretasi atau memberikan saran yang kurang relevan. Kami menerapkan pembatasan ketat (guardrails) pada instruksi AI agar tidak melakukan diagnosis klinis mandiri.</Text>

              <Text className="font-jakarta-bold text-[16px] text-black mt-2 mb-1">6. PERUBAHAN KEBIJAKAN</Text>
              <Text className="font-jakarta-regular text-[14px] text-black mb-6 leading-6">Kebijakan ini dibuat khusus untuk keperluan demonstrasi dan pengujian MVP Calmora (Top 24 IndonesiaNEXT oleh Telkomsel) dan dapat diperbarui sewaktu-waktu seiring dengan perkembangan fungsionalitas produk dan kebutuhan kepatuhan hukum di masa mendatang.{"\n\n"}Terakhir Diperbarui: Agustus 2026</Text>
              <View className="h-8" />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
