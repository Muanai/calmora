import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ visible, onClose }: PrivacyModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-4 py-12">
        <View className="bg-white rounded-[24px] w-full max-h-full overflow-hidden relative">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-[#E5E5E5]">
            <Text className="font-jakarta-bold text-[16px] text-black">Kebijakan Privasi (MVP)</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
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
            <Text className="font-jakarta-regular text-[14px] text-black mb-1 leading-6">• <Text className="font-jakarta-bold">Data Jurnal Kecemasan:</Text> Setiap teks cerita atau curhatan yang Anda tulis di Jurnal Kecemasan akan dienkripsi secara aman dan rahasia. Kami menjamin bahwa isi curhatan Anda tidak akan dikirimkan atau dibaca oleh AI maupun pihak manapun. Sistem backend kami murni hanya menggunakan label (tag) emosi yang Anda pilih secara manual untuk mengkalibrasi tingkat kesulitan Misi Langkah Mikro secara otomatis.</Text>
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
  );
}
