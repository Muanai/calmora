import { View, Image } from "react-native";
import LogoPinkPng from "../assets/logo-pink.png";
import LogoWhitePng from "../assets/logo-white.png";

type LogoProps = {
  variant: "pink" | "white";
  size?: number;
};

export default function Logo({ variant, size = 89 }: LogoProps) {
  const source = variant === "pink" ? LogoPinkPng : LogoWhitePng;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Image 
        source={source} 
        style={{ width: size, height: size, resizeMode: "contain" }} 
      />
    </View>
  );
}
