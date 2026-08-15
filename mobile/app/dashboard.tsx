import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../components/dashboard/Header";
import MascotSection from "../components/dashboard/MascotSection";
import MoodSelector from "../components/dashboard/MoodSelector";
import DailyBanner from "../components/dashboard/DailyBanner";
import ActivityGrid from "../components/dashboard/ActivityGrid";

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-pink-light" edges={['top']}>
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Header />
        <MascotSection />
        
        {/* The white rounded card container that wraps the bottom content */}
        <View className="bg-white flex-1 rounded-t-[40px] pt-4 mt-4 shadow-sm min-h-screen">
          <MoodSelector />
          <DailyBanner />
          <ActivityGrid />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
