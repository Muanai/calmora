import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { useState, useRef, useEffect } from "react";
import RobotIcon from "../../assets/images/robot.svg";
import SendIcon from "../../assets/images/send.svg";
import { useChatStore } from "../../stores/chat-store";
import ChatBubble from "../../components/ChatBubble";

const mascotWaveImg = require("../../assets/images/mascot-wave.png");

export default function ChatScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const userName = (user?.unsafeMetadata?.nama as string) || user?.firstName || user?.fullName?.split(" ")[0] || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "Teman";

  const { messages, isStreaming, sendMessage } = useChatStore();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (inputText.trim() === "" || isStreaming) return;
    sendMessage(inputText.trim(), user?.id || "anonymous", getToken);
    setInputText("");
  };

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 bg-cream z-10 border-b border-[#E5E5E5]/50">
          <RobotIcon width={53} height={53} style={{ marginRight: 12 }} />
          <View className="flex-1">
            <Text className="font-jakarta-bold text-[20px] text-black">Nomi, Teman Ceritamu</Text>
            <Text className="font-jakarta-regular text-[14px] text-[#999999]">Konsultasi berbasis AI</Text>
          </View>
        </View>

        {messages.length === 0 ? (
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
            data={messages}
            keyExtractor={(item) => item.id}
            className="flex-1 bg-cream px-6"
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ChatBubble role={item.role} text={item.text} />
            )}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {/* Bottom Input Area */}
        <View className="bg-cream px-6 py-4 pb-[110px]">
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
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
