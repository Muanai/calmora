import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FormInputProps = TextInputProps & {
  label: string;
  placeholder: string;
  isPassword?: boolean;
  isRequired?: boolean;
  value: string;
  onChangeText: (text: string) => void;
};

export default function FormInput({
  label,
  placeholder,
  isPassword = false,
  isRequired = false,
  value,
  onChangeText,
  ...rest
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full gap-3">
      <Text className="font-jakarta-semibold text-base text-black tracking-wide">
        {label}
        {isRequired && <Text className="text-red-500">*</Text>}
      </Text>
      <View 
        className={`flex-row items-center border rounded-btn h-12 px-4 bg-white ${
          isFocused ? "border-pink" : "border-grey"
        }`}
      >
        <TextInput
          className="flex-1 font-jakarta-regular text-base text-black"
          style={[{ outlineStyle: 'none' } as any]}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
