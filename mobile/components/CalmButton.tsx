import { TouchableOpacity, Text, View } from "react-native";

type CalmButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "pink" | "purple" | "outline-purple";
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

export default function CalmButton({
  title,
  onPress,
  variant = "pink",
  icon,
  fullWidth = false,
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

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`${bgClass} flex-row items-center justify-center gap-2 h-12 rounded-btn px-4 ${fullWidth ? "w-full" : ""}`}
    >
      <Text
        className={`${textClass} font-jakarta-semibold text-base tracking-wide`}
      >
        {title}
      </Text>
      {icon && <View>{icon}</View>}
    </TouchableOpacity>
  );
}
