import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";

type CalmButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "pink" | "purple" | "outline-purple";
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function CalmButton({
  title,
  onPress,
  variant = "pink",
  icon,
  fullWidth = false,
  disabled = false,
  isLoading = false,
}: CalmButtonProps) {
  const bgClass =
    variant === "pink"
      ? "bg-pink"
      : variant === "purple"
        ? "bg-purple"
        : "bg-white border-2 border-purple";

  const textClass =
    variant === "outline-purple"
      ? "text-purple"
      : "text-white";

  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
      className={`${bgClass} flex-row items-center justify-center gap-2 h-12 rounded-btn px-4 ${fullWidth ? "w-full" : ""} ${isDisabled ? "opacity-60" : ""}`}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "outline-purple" ? "#6150C1" : "#FFFFFF"} />
      ) : (
        <>
          <Text
            className={`${textClass} font-jakarta-semibold text-base tracking-wide`}
          >
            {title}
          </Text>
          {icon && <View>{icon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
}
