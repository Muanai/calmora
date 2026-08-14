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
import { useSignIn, useAuth } from "@clerk/clerk-expo";
import CalmButton from "../../components/CalmButton";
import FormInput from "../../components/FormInput";
import Logo from "../../components/Logo";
import SocialLoginOptions from "../../components/SocialLoginOptions";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn, isLoaded: authLoaded } = useAuth();

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [authLoaded, isSignedIn]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!isLoaded) return;
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
        <View nativeID="clerk-captcha" />
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
              />
            </View>
          </View>

          <SocialLoginOptions
            isLogin={true}
            onLoginPress={() => router.replace("/(auth)/sign-up")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
