import { View, Text, TouchableOpacity } from "react-native";

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function RadioGroup({
  label,
  options,
  value,
  onChange,
}: RadioGroupProps) {
  return (
    <View className="w-full">
      <Text className="font-jakarta-semibold text-[16px] text-black mb-3">
        {label}
      </Text>
      <View className="bg-white border border-[#999] rounded-[16px] py-4 px-4 gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            className="flex-row items-center gap-3"
            onPress={() => onChange(option.value)}
            activeOpacity={0.7}
          >
            <View
              className={`w-[15px] h-[15px] rounded-full border items-center justify-center ${
                value === option.value
                  ? "border-[#D7385E] bg-[#D7385E]"
                  : "border-[#999] bg-white"
              }`}
            >
              {value === option.value && (
                <View className="w-2 h-2 rounded-full bg-white" />
              )}
            </View>
            <Text className="font-jakarta-regular text-[16px] text-black">
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
