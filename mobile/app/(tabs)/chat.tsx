import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@clerk/expo";
import RobotIcon from "../../assets/images/robot.svg";
import SendIcon from "../../assets/images/send.svg";

const mascotWaveImg = require("../../assets/images/mascot-wave.png");

export default function ChatScreen() {
  const { user } = useUser();
  const userName = user?.firstName || user?.fullName?.split(" ")[0] || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "Teman";

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 bg-cream">
          <RobotIcon width={53} height={53} style={{ marginRight: 12 }} />
          <View className="flex-1">
            <Text className="font-jakarta-bold text-[20px] text-black">Nomi, Teman Ceritamu</Text>
            <Text className="font-jakarta-regular text-[14px] text-[#999999]">Konsultasi berbasis AI</Text>
          </View>
        </View>

        <ScrollView 
          className="flex-1 bg-cream"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Image 
            source={mascotWaveImg} 
            style={{ width: 250, height: 250, marginBottom: 0 }} 
            resizeMode="contain" 
          />
          <Text className="font-jakarta-bold text-[22px] text-black text-center mb-3">
            Halo, {userName}!
          </Text>
          <Text className="font-jakarta-regular text-[14px] text-[#999999] text-center leading-[22px]">
            Aku siap membantu. Apapun yang kamu rasakan, Havi siap mendengarkan tanpa menghakimi.
          </Text>
        </ScrollView>

        {/* Bottom Input Area */}
        <View className="bg-cream px-6 py-4 pb-[110px]">
          <View className="flex-row items-center bg-white border border-[#D9D9D9] rounded-[16px] pl-4 pr-2 py-2 min-h-[56px]">
            <TextInput 
              placeholder="Tulis apa yang kamu rasakan..."
              className="flex-1 font-jakarta-regular text-[14px] text-black outline-none"
              placeholderTextColor="#999"
              multiline
              maxLength={500}
              style={Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}}
            />
            <TouchableOpacity className="w-[44px] h-[44px] bg-[#357BF7] rounded-[14px] items-center justify-center ml-2">
              <SendIcon width={24} height={24} color="white" style={{ marginLeft: -2, marginTop: 2 }} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
