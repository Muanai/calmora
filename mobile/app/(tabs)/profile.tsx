import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

// SVG Icons
import GearIcon from "../../assets/images/gear.svg";
import CoinIcon from "../../assets/images/coin.svg";
import PulseIcon from "../../assets/images/pulse.svg";
import MissionIcon from "../../assets/images/mission.svg";
import PencilIcon from "../../assets/images/pencil.svg";
import LockIcon from "../../assets/images/lock.svg";
import SubscriptionIcon from "../../assets/images/subscription.svg";
import ChevronRightIcon from "../../assets/images/chevron-right.svg";
import ReferralIcon from "../../assets/images/referral.svg";

// Images
import pfpImg from "../../assets/images/pfp.png";

// Stores
import { useMissionStore } from "../../stores/mission-store";
import { useJournalStore } from "../../stores/journal-store";
import { useGroundingStore } from "../../stores/grounding-store";

// Components
import PrivacyModal from "../../components/PrivacyModal";

type ProfileCardProps = {
  title: string;
  subtitle: string;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  icon: React.ReactNode;
  hasChevron?: boolean;
  chevronColor?: string;
  onPress?: () => void;
};

function ProfileCard({ title, subtitle, bgColor, borderColor, iconBgColor, icon, hasChevron, chevronColor, onPress }: ProfileCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`border ${borderColor} ${bgColor} rounded-[16px] p-4 flex-row items-center justify-between mb-3 shadow-sm`}
    >
      <View className="flex-row items-center flex-1">
        <View className={`${iconBgColor} w-[34px] h-[34px] rounded-[10px] items-center justify-center mr-3`}>
          {icon}
        </View>
        <View className="flex-1 pr-2">
          <Text className="font-jakarta-semibold text-[16px] text-black leading-tight mb-1">{title}</Text>
          <Text className="font-jakarta-regular text-[12px] text-black leading-tight">{subtitle}</Text>
        </View>
      </View>
      {hasChevron && (
        <View className={`w-7 h-7 rounded-full ${chevronColor || 'bg-black'} items-center justify-center overflow-hidden`}>
          <ChevronRightIcon width={28} height={28} />
        </View>
      )}
    </TouchableOpacity>
  );
}

import { api } from "../../lib/api";

export default function ProfileScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [stats, setStats] = useState({ total_missions: 0, total_activities: 0 });

  const { entries, fetchEntries } = useJournalStore();

  const userName = (user?.unsafeMetadata?.nama as string) || user?.firstName || user?.fullName?.split(" ")[0] || "User";
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Agustus 2026';

  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        if (!user?.id) return;
        try {
          const token = await getToken();
          const res = await api.get(`/actions/stats?user_id=${user.id}&_t=${Date.now()}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setStats(res.data);
        } catch (e) {
          console.error("Failed to fetch action stats:", e);
        }
      };

      if (user?.id) {
        fetchEntries(user.id, getToken);
        fetchStats();
      }
    }, [user?.id])
  );

  const journalCount = entries.length;

  const missionSubtitle =
    stats.total_missions === 0
      ? "Belum ada misi terselesaikan"
      : `${stats.total_missions} langkah kecil terselesaikan`;

  const journalSubtitle =
    journalCount === 0
      ? "Belum ada jurnal yang ditulis"
      : `${journalCount} beban pikiran berhasil dilepaskan`;

  const activitySubtitle =
    stats.total_activities === 0
      ? "Belum ada aktivitas menenangkan diri"
      : `${stats.total_activities} kali berhasil menenangkan diri`;

  return (
    <View className="flex-1 bg-white overflow-hidden">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Dark pink base for the header that scrolls with the content. 
            We extend it upwards (-1000) to cover the iOS pull-to-refresh bounce. */}
        <View style={{ position: 'absolute', top: -1000, left: 0, right: 0, height: 1800, backgroundColor: '#D7385E' }} />

        {/* Background Header Decoration - Inverted curves (Arch shape) */}
        {/* They are placed inside the ScrollView so they scroll naturally with the content */}
        <View
          style={{ position: 'absolute', top: insets.top + 60, left: '50%', marginLeft: -500, width: 1000, height: 1000, backgroundColor: '#F3C1CD', borderRadius: 500 }}
        />
        <View
          style={{ position: 'absolute', top: insets.top + 120, left: '50%', marginLeft: -500, width: 1000, height: 1000, backgroundColor: '#FBEBEF', borderRadius: 500 }}
        />
        <View
          style={{ position: 'absolute', top: insets.top + 180, left: '50%', marginLeft: -500, width: 1000, height: 1000, backgroundColor: '#FFFFFF', borderRadius: 500 }}
        />

        {/* Content Container with added top padding to push the avatar down further */}
        <View style={{ flex: 1, paddingTop: insets.top + 100, paddingHorizontal: 24 }}>
          {/* Profile Info & Header */}
          <View className="items-center mt-2 mb-8 w-full relative">
            {/* Settings Button - Absolute positioned to align with top of avatar */}
            <TouchableOpacity
              className="absolute right-0 top-0 w-[40px] h-[40px] bg-white rounded-full items-center justify-center shadow-sm z-10"
              onPress={() => router.push("/settings")}
            >
              <GearIcon width={20} height={20} />
            </TouchableOpacity>

            {/* Avatar */}
            <View className="w-[114px] h-[114px] bg-[#67D4FF] rounded-full items-center justify-center border-8 border-white mb-4 overflow-hidden">
              <Image
                source={user?.imageUrl ? { uri: user.imageUrl } : (pfpImg as any)}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
            <Text className="font-jakarta-bold text-[24px] text-black text-center">{userName}</Text>
            <Text className="font-jakarta-regular text-[14px] text-black text-center mb-4">Bergabung pada {joinDate}</Text>

            <TouchableOpacity className="bg-[#D7385E] rounded-[16px] px-6 py-3 flex-row items-center">
              <CoinIcon width={28} height={28} style={{ marginRight: 8 }} />
              <Text className="font-jakarta-bold text-[20px] text-white">50 Koin</Text>
            </TouchableOpacity>
          </View>

          {/* Perjalanan Tenangmu Section */}
          <Text className="font-jakarta-bold text-[20px] text-black mb-3">Perjalanan Tenangmu</Text>

          <ProfileCard
            title="Aktivitas"
            subtitle={activitySubtitle}
            bgColor="bg-[#FBEBEF]"
            borderColor="border-[#D7385E]"
            iconBgColor="bg-[#D7385E]"
            icon={<PulseIcon width={20} height={20} />}
            hasChevron={true}
            chevronColor="bg-[#D7385E]"
            onPress={() => router.push("/activity")}
          />

          <ProfileCard
            title="Misi"
            subtitle={missionSubtitle}
            bgColor="bg-[#E6F4EE]"
            borderColor="border-[#009455]"
            iconBgColor="bg-[#009455]"
            icon={<MissionIcon width={20} height={20} />}
            hasChevron={true}
            chevronColor="bg-[#009455]"
            onPress={() => router.push("/mission")}
          />

          <ProfileCard
            title="Jurnal"
            subtitle={journalSubtitle}
            bgColor="bg-[#F2F0FC]"
            borderColor="border-[#806DE3]"
            iconBgColor="bg-[#806DE3]"
            icon={<PencilIcon width={20} height={20} />}
            hasChevron={true}
            chevronColor="bg-[#806DE3]"
            onPress={() => router.push("/journal")}
          />

          {/* Spacer to push bottom content down on tall screens (like iPhone 15 Pro Max) */}
          <View style={{ flex: 1, minHeight: 24 }} />

          {/* Langganan Section */}
          <Text className="font-jakarta-bold text-[20px] text-black mb-3">Langganan</Text>

          <ProfileCard
            title="Paket Pahlawan"
            subtitle="Bantu subsidi akses untuk sesama pengguna"
            bgColor="bg-[#EBF2FE]"
            borderColor="border-[#357BF7]"
            iconBgColor="bg-[#357BF7]"
            icon={<SubscriptionIcon width={20} height={20} />}
            hasChevron={true}
            chevronColor="bg-[#357BF7]"
            onPress={() => router.push("/subscription")}
          />

          {/* Kode Referral Section */}
          <Text className="font-jakarta-bold text-[20px] text-black mt-4 mb-3">Kode Referral</Text>

          <ProfileCard
            title="Ajak Teman"
            subtitle="Dapatkan keuntungan bersama"
            bgColor="bg-[#F2F0FC]"
            borderColor="border-[#806DE3]"
            iconBgColor="bg-[#806DE3]"
            icon={<ReferralIcon width={22} height={13} />}
            hasChevron={true}
            chevronColor="bg-[#806DE3]"
            onPress={() => router.push("/referral")}
          />

          {/* Kebijakan Privasi Section */}
          <Text className="font-jakarta-bold text-[20px] text-black mt-4 mb-3">Kebijakan Privasi</Text>

          <ProfileCard
            title="Keamanan & Privasi Cerita"
            subtitle="100% rahasia & terenkripsi"
            bgColor="bg-[#FBEBEF]"
            borderColor="border-[#D7385E]"
            iconBgColor="bg-[#D7385E]"
            icon={<LockIcon width={20} height={20} />}
            hasChevron={true}
            chevronColor="bg-[#D7385E]"
            onPress={() => setPrivacyModalVisible(true)}
          />
        </View>
      </ScrollView>

      <PrivacyModal
        visible={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />
    </View>
  );
}
