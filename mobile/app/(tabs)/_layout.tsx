import { Tabs } from "expo-router";
import { View, Text, Platform, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

function TabBarItem({ route, isFocused, onPress, options }: any) {
  const label = options.title !== undefined ? options.title : route.name;

  let iconName: any = "home";
  let activeWidth = 115;
  
  if (route.name === "index") {
    iconName = "home";
    activeWidth = 115;
  } else if (route.name === "activity") {
    iconName = "pulse";
    activeWidth = 120;
  } else if (route.name === "journal") {
    iconName = "document-text";
    activeWidth = 110;
  } else if (route.name === "chat") {
    iconName = "chatbubbles";
    activeWidth = 90; // Shorter width for 'Chat'
  } else if (route.name === "profile") {
    iconName = "person";
    activeWidth = 105;
  }

  const anim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: false,
      friction: 7,
      tension: 60,
    }).start();
  }, [isFocused]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [40, activeWidth], // Expands dynamically based on text length
  });

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,1)"],
  });

  const iconColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FFFFFF", "#D7385E"],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View
        style={{
          width,
          height: 40,
          backgroundColor: bgColor,
          borderRadius: 30,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center", // Perfectly centers the icon + text together
          overflow: "hidden",
        }}
      >
        <AnimatedIonicons name={iconName} size={24} color={iconColor as any} />
        <Animated.Text
          style={{
            color: "#D7385E",
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 14,
            marginLeft: 6, // Reduce gap slightly so it looks tight and balanced
            opacity: anim,
          }}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps & { insets: any }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#D7385E",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: Platform.OS === "ios" ? 100 + insets.bottom : 100,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: Platform.OS === "ios" ? insets.bottom + 20 : 30,
        paddingTop: 30,
        paddingHorizontal: 24,
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabBarItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            options={options}
          />
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} insets={insets} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Beranda" }} />
      <Tabs.Screen name="activity" options={{ title: "Activity" }} />
      <Tabs.Screen name="journal" options={{ title: "Journal" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
