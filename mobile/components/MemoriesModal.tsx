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
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        padding: 14,
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
            fontSize: 13,
            color: "#333",
            lineHeight: 20,
          }}
        >
          {item.memory_text}
        </Text>
        <Text
          style={{
            fontFamily: "PlusJakartaSans_400Regular",
            fontSize: 11,
            color: "#999",
            marginTop: 4,
          }}
        >
          {item.source === "ai_generated" ? "Dipelajari AI" : "Dibagikan pengguna"} ·{" "}
          {new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={{ fontSize: 16, color: "#FF6B6B" }}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
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
              backgroundColor: "#FFFDF9",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 40,
              maxHeight: "80%",
            }}
          >
            {/* Handle */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: "#E0E0E0",
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_700Bold",
                    fontSize: 18,
                    color: "#1A1A1A",
                  }}
                >
                  🧠 Memori AI
                </Text>
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_400Regular",
                    fontSize: 13,
                    color: "#999",
                    marginTop: 2,
                  }}
                >
                  Konteks yang diingat Nomi tentang kamu
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={{ fontSize: 22, color: "#999" }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Tab Switcher */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#F0F0F0",
                borderRadius: 12,
                padding: 4,
                marginBottom: 16,
              }}
            >
              {(["bio", "ai"] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor: activeTab === tab ? "#FFFFFF" : "transparent",
                    shadowColor: activeTab === tab ? "#000" : "transparent",
                    shadowOpacity: activeTab === tab ? 0.06 : 0,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: activeTab === tab ? 2 : 0,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: activeTab === tab ? "PlusJakartaSans_600SemiBold" : "PlusJakartaSans_400Regular",
                      fontSize: 13,
                      color: activeTab === tab ? "#1A1A1A" : "#999",
                    }}
                  >
                    {tab === "bio" ? "✍️ Tentang Diriku" : "🤖 Dipelajari AI"}
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
                    fontSize: 13,
                    color: "#666",
                    lineHeight: 20,
                    marginBottom: 12,
                  }}
                >
                  Ceritakan tentang dirimu — kepribadian, situasi hidup, preferensi, atau hal apapun yang kamu ingin Nomi tahu.
                </Text>
                <TextInput
                  value={bioText}
                  onChangeText={setBioText}
                  multiline
                  placeholder="Contoh: Saya seorang mahasiswa yang tinggal sendiri di kos, suka anime One Piece, dan sedang berjuang dengan kecemasan sosial..."
                  placeholderTextColor="#BBBBBB"
                  maxLength={2000}
                  style={{
                    backgroundColor: "#F5F5F5",
                    borderRadius: 14,
                    padding: 14,
                    minHeight: 140,
                    fontFamily: "PlusJakartaSans_400Regular",
                    fontSize: 13,
                    color: "#1A1A1A",
                    lineHeight: 22,
                    textAlignVertical: "top",
                    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
                  }}
                />
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_400Regular",
                    fontSize: 11,
                    color: "#BBBBBB",
                    textAlign: "right",
                    marginTop: 4,
                    marginBottom: 14,
                  }}
                >
                  {bioText.length}/2000
                </Text>
                <TouchableOpacity
                  onPress={handleSaveBio}
                  disabled={isSavingBio}
                  style={{
                    backgroundColor: saved ? "#34C759" : "#357BF7",
                    borderRadius: 14,
                    paddingVertical: 14,
                    alignItems: "center",
                  }}
                >
                  {isSavingBio ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text
                      style={{
                        fontFamily: "PlusJakartaSans_600SemiBold",
                        fontSize: 14,
                        color: "white",
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
                    fontSize: 15,
                    color: "#333",
                    marginBottom: 6,
                  }}
                >
                  Belum ada memori tersimpan
                </Text>
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_400Regular",
                    fontSize: 13,
                    color: "#999",
                    textAlign: "center",
                    lineHeight: 20,
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
                />
                <TouchableOpacity
                  onPress={handleClearAll}
                  style={{
                    marginTop: 12,
                    padding: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#FFD6D6",
                    alignItems: "center",
                    backgroundColor: "#FFF5F5",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans_600SemiBold",
                      fontSize: 14,
                      color: "#FF4444",
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
