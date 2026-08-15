import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSignIn, useAuth, useUser } from "@clerk/clerk-expo";
import CalmButton from "../../components/CalmButton";
import FormInput from "../../components/FormInput";
import Logo from "../../components/Logo";
import SocialLoginOptions from "../../components/SocialLoginOptions";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { user, isLoaded: userLoaded } = useUser();

  useEffect(() => {
    if (userLoaded && user) {
      if (user.unsafeMetadata?.kondisi) {
        router.replace("/dashboard");
      } else {
        router.replace("/(auth)/complete-profile");
      }
    }
  }, [userLoaded, user]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!isLoaded) return;
    
    if (!email || !password) {
      alert("Mohon lengkapi Email dan Kata Sandi");
      return;
    }

    setIsLoading(true);

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        router.replace("/dashboard"); // Navigate to post-login
      } else {
        console.log("Requires more steps", completeSignIn.status);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert(err.errors?.[0]?.message || "Terjadi kesalahan saat masuk");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-pink pt-16 pb-24 px-6 items-center">
          <SafeAreaView edges={["top"]}>
            <Logo variant="white" size={93} />
          </SafeAreaView>

          <View className="mt-6 w-full max-w-[305px]">
            <Text className="font-jakarta-bold text-[32px] leading-[38px] text-white text-center">
              Selamat Datang di Calmora!
            </Text>
            <Text className="font-rubik-regular text-sm text-white text-center mt-2 leading-[21px]">
              Masuk untuk melanjutkan perjalanan bersama Nomi. Tanpa tekanan, kapan saja kamu siap.
            </Text>
          </View>
        </View>

        <View
          className="bg-white flex-1 px-6 pt-12 pb-10 -mt-12"
          style={{
            borderTopLeftRadius: 60,
            borderTopRightRadius: 60,
          }}
        >
          <View className="gap-3">
            <FormInput
              label="Email"
              placeholder="Masukkan Email Kamu"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <FormInput
              label="Kata Sandi"
              placeholder="Masukkan Kata Sandi Kamu"
              isPassword
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            <TouchableOpacity className="self-end">
              <Text className="font-rubik-regular text-sm text-black underline">
                Lupa kata sandi?
              </Text>
            </TouchableOpacity>

            <View className="mt-2">
              <CalmButton
                title={isLoading ? "Memuat..." : "Masuk"}
                onPress={handleLogin}
                variant="pink"
                fullWidth
                isLoading={isLoading}
              />
            </View>
          </View>

          <SocialLoginOptions
            isLogin={true}
            onLoginPress={() => router.push("/(auth)/sign-up")}
            onLoadingChange={setIsLoading}
          />
          {/* Clerk CAPTCHA container with explicit minHeight to ensure Cloudflare widget renders properly */}
          <View nativeID="clerk-captcha" style={{ minHeight: 100, width: '100%', marginTop: 20 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
