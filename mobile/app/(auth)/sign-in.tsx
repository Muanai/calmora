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
import { useSignIn, useUser, useClerk } from "@clerk/expo";
import CalmButton from "../../components/CalmButton";
import FormInput from "../../components/FormInput";
import Logo from "../../components/Logo";
import SocialLoginOptions from "../../components/SocialLoginOptions";

export default function SignInScreen() {
  const router = useRouter();
  // @ts-ignore - Clerk Expo v4 discriminated union - signIn exists when clerk.loaded
  const { signIn } = useSignIn() as any;
  const { user, isLoaded: userLoaded } = useUser();
  const clerk = useClerk();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (userLoaded && user) {
      if (user.unsafeMetadata?.kondisi) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/complete-profile");
      }
    }
  }, [userLoaded, user, isLoading]);

  const handleLogin = async () => {
    if (!clerk.loaded || !signIn) return;
    
    if (!email || !password) {
      alert("Mohon lengkapi Email dan Kata Sandi");
      return;
    }

    setIsLoading(true);

    try {
      // @ts-ignore - Clerk v4: signIn.create() return type is a narrow union
      const result = await (signIn.create as any)({
        identifier: email.trim(),
        password,
      });

      const status: string | undefined = result?.status ?? signIn?.status;
      if (status === "complete") {
        await clerk.setActive({ session: result?.createdSessionId ?? signIn?.createdSessionId });
        router.replace("/(tabs)");
      } else if (status === "needs_first_factor") {
        // Fallback for 2-step login if single-step create doesn't work
        const attempt = await (signIn.attemptFirstFactor as any)({
          strategy: "password",
          password,
        });
        if (attempt.status === "complete") {
          await clerk.setActive({ session: attempt.createdSessionId });
          router.replace("/(tabs)");
        } else {
          console.log("Attempt status:", attempt.status);
          alert("Gagal masuk. Status: " + attempt.status);
        }
      } else {
        console.log("Sign in attempt requires more steps:", JSON.stringify(result, null, 2));
        alert("Gagal masuk. Status: " + status);
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
        </View>
      </ScrollView>
      {/* Clerk CAPTCHA - di luar ScrollView agar iframe Turnstile bisa diklik */}
      <View nativeID="clerk-captcha" />
    </KeyboardAvoidingView>
  );
}
