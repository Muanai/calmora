import { View } from "react-native";
import LogoPinkSvg from "../assets/logo-pink.svg";
import LogoWhiteSvg from "../assets/logo-white.svg";

type LogoProps = {
  variant: "pink" | "white";
  size?: number;
};

export default function Logo({ variant, size = 89 }: LogoProps) {
  const SvgComponent = variant === "pink" ? LogoPinkSvg : LogoWhiteSvg;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <SvgComponent width={size} height={size} />
    </View>
  );
}
