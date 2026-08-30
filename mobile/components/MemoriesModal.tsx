import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useMemoryStore, AiMemory } from "../stores/memory-store";
import { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";

const BrainIcon = ({ color = "#357BF7", size = 24 }: { color?: string, size?: number }) => (
  <Svg width={size} height={(size * 27) / 30} viewBox="0 0 30 27" fill="none">
    <Path d="M9.99384 0C11.0545 0 12.0717 0.406252 12.8216 1.12938C13.5716 1.85252 13.9929 2.8333 13.9929 3.85596V5.78394C13.9929 6.55094 13.6769 7.28652 13.1145 7.82887C12.552 8.37122 11.7891 8.67591 10.9936 8.67591C10.7285 8.67591 10.4742 8.77747 10.2867 8.95825C10.0992 9.13904 9.99384 9.38423 9.99384 9.6399C9.99384 9.89556 10.0992 10.1408 10.2867 10.3215C10.4742 10.5023 10.7285 10.6039 10.9936 10.6039C12.0761 10.6017 13.1287 10.2607 13.9929 9.63218V13.4959C13.9929 14.7742 13.4663 16.0002 12.5288 16.9041C11.5913 17.808 10.3199 18.3158 8.99407 18.3158C8.72891 18.3158 8.47462 18.4174 8.28712 18.5982C8.09963 18.7789 7.99429 19.0241 7.99429 19.2798C7.99429 19.5355 8.09963 19.7807 8.28712 19.9614C8.47462 20.1422 8.72891 20.2438 8.99407 20.2438C10.9536 20.2438 12.7232 19.4649 13.9929 18.2136V23.1358C13.9951 24.1258 13.6023 25.0787 12.8959 25.7971C12.1894 26.5155 11.2235 26.9444 10.1981 26.995C9.17263 27.0455 8.16633 26.7138 7.38757 26.0686C6.60881 25.4234 6.11727 24.5141 6.01474 23.5291L5.99475 23.1358L5.68682 23.128C4.34833 23.0609 3.07173 22.5634 2.06068 21.715C1.04963 20.8666 0.362376 19.7162 0.108555 18.4473C-0.145265 17.1783 0.0489708 15.864 0.660278 14.7139C1.27158 13.5638 2.26474 12.6443 3.48131 12.1019C2.83821 11.4879 2.38 10.717 2.15554 9.87158C1.93109 9.02616 1.94879 8.13784 2.20678 7.30136C2.46476 6.46487 2.95335 5.71157 3.62045 5.12178C4.28754 4.53199 5.10814 4.12782 5.99475 3.95236V3.85596C5.99475 2.8333 6.41608 1.85252 7.16605 1.12938C7.91603 0.406252 8.93322 0 9.99384 0ZM19.9916 0C21.0522 0 22.0694 0.406252 22.8194 1.12938C23.5693 1.85252 23.9907 2.8333 23.9907 3.85596V3.95236C24.8771 4.12808 25.6975 4.53245 26.3644 5.12235C27.0312 5.71226 27.5195 6.46558 27.7773 7.30203C28.0351 8.13848 28.0526 9.02669 27.828 9.87199C27.6035 10.7173 27.1452 11.488 26.5021 12.1019C27.7229 12.6412 28.7205 13.56 29.3351 14.7111C29.9498 15.8622 30.1458 17.179 29.8917 18.4503C29.6377 19.7216 28.9484 20.8739 27.9342 21.7224C26.92 22.571 25.6398 23.0666 24.2986 23.13L23.9907 23.1358C23.9907 24.1584 23.5693 25.1392 22.8194 25.8623C22.0694 26.5855 21.0522 26.9917 19.9916 26.9917C18.931 26.9917 17.9138 26.5855 17.1638 25.8623C16.4138 25.1392 15.9925 24.1584 15.9925 23.1358V18.2136C16.6437 18.8557 17.4213 19.366 18.2796 19.7147C19.138 20.0633 20.0599 20.2432 20.9914 20.2438C21.2565 20.2438 21.5108 20.1422 21.6983 19.9614C21.8858 19.7807 21.9911 19.5355 21.9911 19.2798C21.9911 19.0241 21.8858 18.7789 21.6983 18.5982C21.5108 18.4174 21.2565 18.3158 20.9914 18.3158C19.6656 18.3158 18.3941 17.808 17.4566 16.9041C16.5192 16.0002 15.9925 14.7742 15.9925 13.4959V9.63218C16.8283 10.2395 17.8641 10.6039 18.9918 10.6039C19.257 10.6039 19.5113 10.5023 19.6988 10.3215C19.8863 10.1408 19.9916 9.89556 19.9916 9.6399C19.9916 9.38423 19.8863 9.13904 19.6988 8.95825C19.5113 8.77747 19.257 8.67591 18.9918 8.67591C18.1963 8.67591 17.4335 8.37122 16.871 7.82887C16.3085 7.28652 15.9925 6.55094 15.9925 5.78394V3.85596C15.9925 2.8333 16.4138 1.85252 17.1638 1.12938C17.9138 0.406252 18.931 0 19.9916 0Z" fill={color} />
  </Svg>
);

const WriteIcon = ({ color = "white", size = 18 }: { color?: string, size?: number }) => (
  <Svg width={size} height={(size * 19) / 18} viewBox="0 0 18 19" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M0 0H13.2875L7.08333 6.20417V10.4167H11.2958L16.6667 5.045V15.4167H4.40583L0 18.17V0ZM10.7775 9.16667L17.5 2.44417L15.0558 0L8.33333 6.7225V9.16667H10.7775Z" fill={color} />
  </Svg>
);

const RobotIcon = ({ color = "white", size = 24 }: { color?: string, size?: number }) => (
  <Svg width={size} height={size} viewBox="9 11 35 31" fill="none">
    <Path d="M26.5031 13C27.1845 13.0012 27.8465 13.2196 28.3867 13.6214C28.9269 14.0233 29.3153 14.5862 29.4917 15.2231C29.6682 15.8601 29.6229 16.5355 29.3628 17.145C29.1027 17.7545 28.6424 18.2641 28.053 18.595V19H32.7028C34.347 19 35.924 19.6321 37.0866 20.7574C38.2493 21.8826 38.9025 23.4087 38.9025 25V25.075C39.7771 25.2486 40.563 25.7091 41.1274 26.3787C41.6918 27.0483 42 27.8859 42 28.75C42 29.6141 41.6918 30.4517 41.1274 31.1213C40.563 31.7909 39.7771 32.2514 38.9025 32.425V34C38.9025 35.5913 38.2493 37.1174 37.0866 38.2426C35.924 39.3679 34.347 40 32.7028 40H20.3034C18.6592 40 17.0822 39.3679 15.9196 38.2426C14.7569 37.1174 14.1037 35.5913 14.1037 34V32.425C13.2278 32.2529 12.4403 31.793 11.8746 31.1232C11.309 30.4534 11 29.615 11 28.75C11 27.885 11.309 27.0466 11.8746 26.3768C12.4403 25.707 13.2278 25.2471 14.1037 25.075V25C14.1037 23.4087 14.7569 21.8826 15.9196 20.7574C17.0822 19.6321 18.6592 19 20.3034 19H24.9532V18.595C24.3638 18.2641 23.9035 17.7545 23.6434 17.145C23.3833 16.5355 23.338 15.8601 23.5145 15.2231C23.6909 14.5862 24.0793 14.0233 24.6195 13.6214C25.1597 13.2196 25.8217 13.0012 26.5031 13ZM21.8533 26.5C21.4423 26.5 21.048 26.658 20.7574 26.9393C20.4667 27.2206 20.3034 27.6022 20.3034 28V31C20.3034 31.3978 20.4667 31.7794 20.7574 32.0607C21.048 32.342 21.4423 32.5 21.8533 32.5C22.2644 32.5 22.6586 32.342 22.9493 32.0607C23.24 31.7794 23.4033 31.3978 23.4033 31V28C23.4033 27.6022 23.24 27.2206 22.9493 26.9393C22.6586 26.658 22.2644 26.5 21.8533 26.5ZM31.1529 26.5C30.7418 26.5 30.3476 26.658 30.0569 26.9393C29.7662 27.2206 29.6029 27.6022 29.6029 28V31C29.6029 31.3978 29.7662 31.7794 30.0569 32.0607C30.3476 32.342 30.7418 32.5 31.1529 32.5C31.5639 32.5 31.9582 32.342 32.2488 32.0607C32.5395 31.7794 32.7028 31.3978 32.7028 31V28C32.7028 27.6022 32.5395 27.2206 32.2488 26.9393C31.9582 26.658 31.5639 26.5 31.1529 26.5Z" fill={color} />
  </Svg>
);

interface MemoriesModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  getToken: () => Promise<string | null>;
}

export default function MemoriesModal({ visible, onClose, userId, getToken }: MemoriesModalProps) {
  const { memories, isLoading, deleteMemory, clearAllMemories, userBio, isSavingBio, fetchBio, saveBio } =
    useMemoryStore();

  const [activeTab, setActiveTab] = useState<"bio" | "ai">("bio");
  const [bioText, setBioText] = useState(userBio);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (visible && userId) {
      fetchBio(userId, getToken);
    }
  }, [visible, userId]);

  useEffect(() => {
    setBioText(userBio);
  }, [userBio]);

  const handleSaveBio = async () => {
    await saveBio(userId, bioText, getToken);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (memoryId: string) => {
    if (Platform.OS === "web") {
      if (window.confirm("Hapus Memori?\nAI tidak akan lagi mengingat informasi ini dalam percakapan berikutnya.")) {
        deleteMemory(memoryId, userId, getToken);
      }
      return;
    }
    Alert.alert(
      "Hapus Memori?",
      "AI tidak akan lagi mengingat informasi ini dalam percakapan berikutnya.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => deleteMemory(memoryId, userId, getToken),
        },
      ]
    );
  };

  const handleClearAll = () => {
    if (Platform.OS === "web") {
      if (
        window.confirm(
          "Hapus Semua Memori?\nAI akan lupa semua konteks yang sudah dipelajari tentang kamu. Tindakan ini tidak bisa dibatalkan."
        )
      ) {
        clearAllMemories(userId, getToken);
      }
      return;
    }
    Alert.alert(
      "Hapus Semua Memori?",
      "AI akan lupa semua konteks yang sudah dipelajari tentang kamu. Tindakan ini tidak bisa dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: () => clearAllMemories(userId, getToken),
        },
      ]
    );
  };

  const renderMemoryItem = ({ item }: { item: AiMemory }) => (
    <View
      style={{
        backgroundColor: "#EBF2FE",
        borderColor: "#357BF7",
        borderWidth: 1,
        borderRadius: 16,
        padding: 20,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "PlusJakartaSans_400Regular",
            fontSize: 14,
            color: "#357BF7",
            lineHeight: 21,
          }}
        >
          {item.memory_text}
        </Text>
        <Text
          style={{
            fontFamily: "PlusJakartaSans_400Regular",
            fontSize: 12,
            color: "#999",
            marginTop: 10,
            textAlign: "right",
          }}
        >
          {item.source === "ai_generated" ? "Dipelajari AI" : "Dibagikan pengguna"} :{" "}
          {new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={{ fontSize: 16, color: "#FF6B6B", fontWeight: "bold" }}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 60,
              borderTopRightRadius: 60,
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 40,
              maxHeight: "85%",
            }}
          >
            {/* Handle */}
            <View
              style={{
                width: 56,
                height: 4,
                backgroundColor: "#E0E0E0",
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 24,
              }}
            />

            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                <BrainIcon size={24} color="#357BF7" />
                <View>
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans_700Bold",
                      fontSize: 20,
                      color: "#000000",
                      lineHeight: 24,
                    }}
                  >
                    Memori AI
                  </Text>
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans_400Regular",
                      fontSize: 12,
                      color: "#999",
                      marginTop: 2,
                      lineHeight: 18,
                    }}
                  >
                    Konteks yang diingat Nomi tentang kamu
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={{ fontSize: 22, color: "#999" }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Tab Switcher */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#EBF2FE",
                borderRadius: 16,
                padding: 7,
                marginBottom: 16,
              }}
            >
              {(["bio", "ai"] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 8,
                    backgroundColor: activeTab === tab ? "#357BF7" : "transparent",
                  }}
                >
                  <View style={{ width: 28, alignItems: "center", justifyContent: "center" }}>
                    {tab === "bio" ? (
                      <WriteIcon size={18} color={activeTab === tab ? "#FFFFFF" : "#000000"} />
                    ) : (
                      <RobotIcon size={24} color={activeTab === tab ? "#FFFFFF" : "#000000"} />
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans_600SemiBold",
                      fontSize: 16,
                      color: activeTab === tab ? "#FFFFFF" : "#000000",
                    }}
                  >
                    {tab === "bio" ? "Tentang Diriku" : "Dipelajari AI"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Content */}
            {activeTab === "bio" ? (
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_400Regular",
                    fontSize: 14,
                    color: "#999",
                    lineHeight: 21,
                    marginBottom: 16,
                  }}
                >
                  Ceritakan tentang dirimu, kepribadian, situasi hidup, preferensi atau hal apapun yang kamu ingin Nomi tahu.
                </Text>
                <TextInput
                  value={bioText}
                  onChangeText={setBioText}
                  multiline
                  placeholder="Contoh : Saya seorang mahasiswa yang tinggal sendiri di kos, suka nonton anime One Piece, dan sedang berjuang dengan kecemasan sosial."
                  placeholderTextColor="#82A6E9"
                  maxLength={2000}
                  style={{
                    backgroundColor: "#EBF2FE",
                    borderColor: "#357BF7",
                    borderWidth: 1,
                    borderRadius: 16,
                    padding: 20,
                    minHeight: 140,
                    fontFamily: "PlusJakartaSans_400Regular",
                    fontSize: 14,
                    color: "#357BF7",
                    lineHeight: 21,
                    textAlignVertical: "top",
                    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
                  }}
                />
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_400Regular",
                    fontSize: 12,
                    color: "#999",
                    textAlign: "right",
                    marginTop: 8,
                    marginBottom: 16,
                  }}
                >
                  {bioText.length}/2000
                </Text>
                <TouchableOpacity
                  onPress={handleSaveBio}
                  disabled={isSavingBio}
                  style={{
                    backgroundColor: saved ? "#34C759" : "#357BF7",
                    borderRadius: 16,
                    height: 48,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {isSavingBio ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text
                      style={{
                        fontFamily: "PlusJakartaSans_600SemiBold",
                        fontSize: 16,
                        color: "white",
                        letterSpacing: 0.16,
                      }}
                    >
                      {saved ? "✓ Tersimpan!" : "Simpan"}
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            ) : isLoading ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <ActivityIndicator color="#357BF7" />
              </View>
            ) : memories.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <Text style={{ fontSize: 36, marginBottom: 12 }}>💭</Text>
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_700Bold",
                    fontSize: 16,
                    color: "#000",
                    marginBottom: 6,
                  }}
                >
                  Belum ada memori tersimpan
                </Text>
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_400Regular",
                    fontSize: 14,
                    color: "#999",
                    textAlign: "center",
                    lineHeight: 21,
                  }}
                >
                  Nomi akan mulai mengingat konteks penting dari percakapanmu secara otomatis.
                </Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={memories}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMemoryItem}
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: 340 }}
                  contentContainerStyle={{ paddingBottom: 16 }}
                />
                <TouchableOpacity
                  onPress={handleClearAll}
                  style={{
                    backgroundColor: "#D7385E",
                    borderRadius: 16,
                    height: 48,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans_600SemiBold",
                      fontSize: 16,
                      color: "white",
                      letterSpacing: 0.16,
                    }}
                  >
                    Hapus Semua Memori
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
