import { Tabs } from "expo-router";
import { View, Text, Platform, TouchableOpacity, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";
import { HomeIcon, ActivityIcon, MissionIcon, MessageIcon, ProfileIcon } from "../../components/icons/TabBarIcons";

function TabBarItem({ route, isFocused, onPress, options }: any) {
  const label = options.title !== undefined ? options.title : route.name;

  let IconComponent = HomeIcon;
  let activeWidth = 125;
  
  if (route.name === "index") {
    IconComponent = HomeIcon;
    activeWidth = 114;
  } else if (route.name === "activity") {
    IconComponent = ActivityIcon;
    activeWidth = 130;
  } else if (route.name === "mission") {
    IconComponent = MissionIcon;
    activeWidth = 89;
  } else if (route.name === "chat") {
    IconComponent = MessageIcon;
    activeWidth = 98;
  } else if (route.name === "profile") {
    IconComponent = ProfileIcon;
    activeWidth = 106;
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
    outputRange: [48, activeWidth], // Expands dynamically based on text length
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
          height: 48,
          backgroundColor: bgColor,
          borderRadius: 24,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: 12,
          overflow: "hidden",
        }}
      >
        <View style={{ width: 24, height: 24, justifyContent: "center", alignItems: "center" }}>
          <Animated.View style={{ opacity: Animated.subtract(1, anim), position: "absolute" }}>
            <IconComponent color="#FFFFFF" size={24} />
          </Animated.View>
          <Animated.View style={{ opacity: anim, position: "absolute" }}>
            <IconComponent color="#D7385E" size={24} />
          </Animated.View>
        </View>
        
        <Animated.Text
          style={{
            color: "#D7385E",
            fontFamily: "PlusJakartaSans_700Bold",
            fontSize: 14,
            marginLeft: 8,
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

function CustomTabBar({ state, descriptors, navigation, insets }: any) {
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
        paddingHorizontal: 20,
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 10,
        zIndex: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      }}
    >
      {state.routes.map((route: any, index: number) => {
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
      <Tabs.Screen name="activity" options={{ title: "Aktivitas" }} />
      <Tabs.Screen name="mission" options={{ title: "Misi" }} />
      <Tabs.Screen name="chat" options={{ title: "Pesan" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
