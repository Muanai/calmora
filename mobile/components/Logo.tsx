import { View, Image } from "react-native";

const LOGO_PINK = require("../assets/logo-pink.png");
const LOGO_WHITE = require("../assets/logo-white.png");

type LogoProps = {
  variant: "pink" | "white";
  size?: number;
};

export default function Logo({ variant, size = 89 }: LogoProps) {
  const source = variant === "pink" ? LOGO_PINK : LOGO_WHITE;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}
