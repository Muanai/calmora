import { View, Text } from "react-native";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export default function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  // width percentage based on step
  // e.g. step 1 of 3 -> 33%
  const percentage = (step / totalSteps) * 100;

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-1 mr-2 relative justify-center h-5">
        {/* Background track */}
        <View className="w-full h-[2px] bg-[#999] absolute top-1/2 -translate-y-1/2" />
        {/* Fill track */}
        <View
          className="h-[2px] bg-pink absolute top-1/2 -translate-y-1/2"
          style={{ width: `${percentage}%` }}
        />
      </View>
      <Text className="font-jakarta-regular text-[14px] text-[#999]">
        {step}/{totalSteps}
      </Text>
    </View>
  );
}
