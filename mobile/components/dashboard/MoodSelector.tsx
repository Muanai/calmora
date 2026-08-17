import { View, Text, TouchableOpacity } from "react-native";
import AngryIcon from "../../assets/angry.svg";
import SadIcon from "../../assets/sad.svg";
import PanicIcon from "../../assets/panic.svg";
import HappyIcon from "../../assets/happy.svg";

const MOODS = [
  { id: "angry", label: "Marah", Icon: AngryIcon, color: "#D7385E" },
  { id: "sad", label: "Sedih", Icon: SadIcon, color: "#806DE3" },
  { id: "panic", label: "Panik", Icon: PanicIcon, color: "#FFC925" },
  { id: "happy", label: "Senang", Icon: HappyIcon, color: "#009455" },
];

export default function MoodSelector() {
  return (
    <View className="mb-8 items-center w-full">
      <View className="flex-row justify-between items-center px-8 w-full mb-6">
        {MOODS.map((mood) => (
          <TouchableOpacity key={mood.id} className="items-center gap-2" activeOpacity={0.7}>
            <mood.Icon width={67} height={70} style={{ overflow: 'visible' }} />
            <Text className="font-jakarta-semibold text-sm text-black text-center">{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Decorative Bottom Line matching Figma */}
      <View className="h-[1px] w-[88%] bg-[#E5E5E5]" />
    </View>
  );
}
