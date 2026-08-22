import { View, Text } from "react-native";
import { Role } from "../stores/chat-store";
import RobotIcon from "../assets/images/robot.svg";

type ChatBubbleProps = {
  role: Role;
  text: string;
};

export default function ChatBubble({ role, text }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <View className={`w-full flex-row mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <View className="mr-3 mt-1">
          <RobotIcon width={32} height={32} />
        </View>
      )}

      <View
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser ? "bg-[#357BF7] rounded-tr-sm" : "bg-white border border-[#E5E5E5] rounded-tl-sm"
        }`}
      >
        {text === "" && !isUser ? (
          <Text className="font-jakarta-regular text-[14px] text-[#999]">Sedang mengetik...</Text>
        ) : (
          <Text
            className={`font-jakarta-regular text-[14px] leading-6 ${
              isUser ? "text-white" : "text-black"
            }`}
          >
            {text}
          </Text>
        )}
      </View>
    </View>
  );
}
