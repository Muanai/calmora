import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, FlatList, ActivityIndicator, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { useState, useRef, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import RobotIcon from "../../assets/images/robot.svg";
import SendIcon from "../../assets/images/send.svg";
import { useChatStore } from "../../stores/chat-store";
import { useMemoryStore } from "../../stores/memory-store";
import ChatBubble from "../../components/ChatBubble";
import MemoriesModal from "../../components/MemoriesModal";

const mascotWaveImg = require("../../assets/images/mascot-wave.png");

const TelephoneIcon = (props: any) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M20 10.999H22C22 5.869 18.127 2 12.99 2V4C17.052 4 20 6.943 20 10.999Z" fill="#357BF7" />
    <Path d="M13 7.99999C15.103 7.99999 16 8.89699 16 11H18C18 7.77499 16.225 5.99999 13 5.99999V7.99999ZM16.422 13.443C16.23 13.2681 15.9774 13.1748 15.7178 13.1828C15.4582 13.1909 15.2119 13.2996 15.031 13.486L12.638 15.947C12.062 15.837 10.904 15.476 9.71204 14.287C8.52004 13.094 8.15904 11.933 8.05204 11.361L10.511 8.96699C10.6975 8.78612 10.8062 8.53982 10.8142 8.2802C10.8222 8.02059 10.7289 7.76804 10.554 7.57599L6.85904 3.51299C6.68408 3.32035 6.44092 3.2035 6.18119 3.18725C5.92146 3.17101 5.66564 3.25665 5.46804 3.42599L3.29804 5.28699C3.12515 5.46051 3.02196 5.69145 3.00804 5.93599C2.99304 6.18599 2.70704 12.108 7.29904 16.702C11.305 20.707 16.323 21 17.705 21C17.907 21 18.031 20.994 18.064 20.992C18.3084 20.9776 18.5389 20.874 18.712 20.701L20.572 18.53C20.7415 18.3325 20.8273 18.0768 20.8113 17.817C20.7952 17.5573 20.6785 17.3141 20.486 17.139L16.422 13.443Z" fill="#357BF7" />
  </Svg>
);

export default function ChatScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const userName = (user?.unsafeMetadata?.nama as string) || user?.firstName || user?.fullName?.split(" ")[0] || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "Teman";

  const { messages, isStreaming, isLoadingHistory, sendMessage, fetchHistory } = useChatStore();
  const { fetchMemories, fetchBio } = useMemoryStore();
  const [inputText, setInputText] = useState("");
  const [memoriesVisible, setMemoriesVisible] = useState(false);
  const [hotlineVisible, setHotlineVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (user?.id) {
      fetchHistory(user.id, getToken);
      fetchMemories(user.id, getToken);
      fetchBio(user.id, getToken);
    }
  }, [user?.id]);

  const handleSend = () => {
    if (inputText.trim() === "" || isStreaming) return;
    sendMessage(inputText.trim(), user?.id || "anonymous", getToken);
    setInputText("");
  };


  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 bg-cream z-10">
          <View className="w-10 h-10 rounded-[12px] bg-[#357BF7] items-center justify-center mr-3">
            <RobotIcon width={40} height={40} />
          </View>
          <View className="flex-1">
            <Text className="font-jakarta-bold text-[20px] text-black">Halo, Aku Nomi</Text>
            <Text className="font-jakarta-regular text-[14px] text-[#999999]">Teman cerita berbasis AI</Text>
          </View>
          {/* Memory button */}
          <TouchableOpacity
            onPress={() => {
              if (user?.id) {
                fetchMemories(user.id, getToken);
              }
              setMemoriesVisible(true);
            }}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: "#F0F4FF",
              alignItems: "center",
              justifyContent: "center",
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={{ fontSize: 18 }}>🧠</Text>
          </TouchableOpacity>
        </View>

        <View className="h-[1px] bg-[#E5E5E5]/50 mx-6 z-10" />

        {isLoadingHistory ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFDF9" }}>
            <ActivityIndicator color="#357BF7" size="large" />
            <Text
              style={{
                fontFamily: "PlusJakartaSans_400Regular",
                fontSize: 13,
                color: "#999",
                marginTop: 12,
              }}
            >
              Memuat percakapan sebelumnya...
            </Text>
          </View>
        ) : messages.length === 0 ? (
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
              Aku siap membantu. Apapun yang kamu rasakan, Nomi siap mendengarkan tanpa menghakimi.
            </Text>
          </ScrollView>
        ) : (
          <FlatList
            ref={flatListRef}
            data={[...messages].reverse()}
            keyExtractor={(item) => item.id}
            className="flex-1 bg-cream px-6"
            contentContainerStyle={{ paddingTop: 165, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            inverted
            renderItem={({ item }) => (
              <ChatBubble role={item.role} text={item.text} />
            )}
            ListHeaderComponent={() => (
              <View className="items-center mt-2 mb-6 px-2">
                <Text className="font-jakarta-regular text-[12px] text-black text-center leading-[18px]">
                  Nomi adalah AI, bukan tenaga profesional. Jika butuh bantuan lebih lanjut silahkan hubungi{" "}
                  <Text
                    className="font-jakarta-bold text-[#357BF7] underline"
                    onPress={() => setHotlineVisible(true)}
                  >
                    Hotline
                  </Text>
                </Text>
              </View>
            )}
          />
        )}

        {/* Bottom Input Area */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 253, 249, 0.9)', '#FFFDF9']}
          locations={[0, 0.4, 1]}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 110 }}
          pointerEvents="box-none"
        >
          <View className="flex-row items-center bg-white border border-[#D9D9D9] rounded-[24px] pl-4 pr-2 py-2 min-h-[56px] max-h-[140px]">
            <TextInput
              placeholder="Tulis apa yang kamu rasakan..."
              className="flex-1 font-jakarta-regular text-[14px] text-black"
              placeholderTextColor="#999"
              multiline
              maxLength={500}
              value={inputText}
              onChangeText={setInputText}
              textAlignVertical="top"
              style={[
                { minHeight: 40, paddingTop: 6, paddingBottom: 4 },
                Platform.OS === 'web' ? {
                  outlineStyle: 'none',
                  maxHeight: 120,
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                } as any : { maxHeight: 120 }
              ]}
            />
            <TouchableOpacity
              className={`w-[40px] h-[40px] rounded-[16px] items-center justify-center ml-2 flex-shrink-0 ${inputText.trim() && !isStreaming ? "bg-[#357BF7]" : "bg-[#A0C4FF]"
                }`}
              onPress={handleSend}
              disabled={!inputText.trim() || isStreaming}
            >
              {isStreaming ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <View style={{ transform: [{ translateX: -0.5 }, { translateY: 1.5 }] }}>
                  <SendIcon width={22} height={22} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>

      <MemoriesModal
        visible={memoriesVisible}
        onClose={() => setMemoriesVisible(false)}
        userId={user?.id || ""}
        getToken={getToken}
      />

      <Modal
        visible={hotlineVisible}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-[24px] w-full p-6 relative">
            <TouchableOpacity
              className="absolute right-4 top-4 p-2 z-10"
              onPress={() => setHotlineVisible(false)}
            >
              <Feather name="x" size={24} color="#999999" />
            </TouchableOpacity>

            <Text className="font-jakarta-bold text-[20px] text-[#357BF7] leading-tight pr-6 mb-4">
              Kamu Berharga & Tidak Sendirian
            </Text>

            <Text className="font-jakarta-regular text-[14px] text-black leading-6 mb-6">
              Bantuan profesional resmi siap mendengarkanmu tanpa menghakimi. Layanan ini privat & bebas biaya.
            </Text>

            <View className="h-[1px] bg-[#E5E5E5] w-full mb-6" />

            <View className="flex-row items-center mb-4">
              <TelephoneIcon width={24} height={24} />
              <Text className="font-jakarta-bold text-[16px] text-black ml-3 flex-1">
                Layanan Utama : Sejiwa (Kemenkes RI)
              </Text>
            </View>

            <View className="flex-col gap-2">
              <Text className="font-jakarta-regular text-[14px] text-black">
                1. Tekan tombol telepon melalui ponsel kamu
              </Text>
              <Text className="font-jakarta-regular text-[14px] text-black">
                2. Hubungi <Text className="font-jakarta-bold">119</Text> dari ponsel kamu
              </Text>
              <Text className="font-jakarta-regular text-[14px] text-black">
                3. Pilih sambungan ekstensi <Text className="font-jakarta-bold">8</Text> untuk konseling
              </Text>
              <Text className="font-jakarta-regular text-[14px] text-black">
                4. Ceritakan apa yang kamu rasakan pelan-pelan
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
