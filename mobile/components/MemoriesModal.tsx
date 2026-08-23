import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { useMemoryStore, AiMemory } from "../stores/memory-store";

interface MemoriesModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  getToken: () => Promise<string | null>;
}

export default function MemoriesModal({ visible, onClose, userId, getToken }: MemoriesModalProps) {
  const { memories, isLoading, deleteMemory, clearAllMemories } = useMemoryStore();

  const handleDelete = (memoryId: string) => {
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

  const renderItem = ({ item }: { item: AiMemory }) => (
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
            maxHeight: "75%",
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
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
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

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: "#F0F0F0", marginVertical: 16 }} />

          {/* Content */}
          {isLoading ? (
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
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 380 }}
              />
              <TouchableOpacity
                onPress={handleClearAll}
                style={{
                  marginTop: 16,
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
    </Modal>
  );
}
