import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FormInputProps = TextInputProps & {
  label: string;
  placeholder: string;
  isPassword?: boolean;
  value: string;
  onChangeText: (text: string) => void;
};

export default function FormInput({
  label,
  placeholder,
  isPassword = false,
  value,
  onChangeText,
  ...rest
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full gap-3">
      <Text className="font-jakarta-semibold text-base text-black tracking-wide">
        {label}
      </Text>
      <View className="flex-row items-center border border-grey rounded-btn h-12 px-4 bg-white">
        <TextInput
          className="flex-1 font-jakarta-regular text-base text-black"
          placeholder={placeholder}
          placeholderTextColor="#999999"
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#999999"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
