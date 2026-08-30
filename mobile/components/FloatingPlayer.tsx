import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '../stores/player-store';
import { CARDS, IconRileks, IconLelap, IconAlam, IconFokus } from '../app/meditation';
import Svg, { Path } from 'react-native-svg';

const IconMaximize = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path d="M13.0917 11.9083L11.9083 13.0917L14.4083 15.5917L12.5 17.5H17.5V12.5L15.5917 14.4083L13.0917 11.9083ZM6.90833 8.09167L8.09167 6.90833L5.59167 4.40833L7.5 2.5H2.5V7.5L4.40833 5.59167L6.90833 8.09167ZM14.4083 4.40833L11.9083 6.90833L13.0917 8.09167L15.5917 5.59167L17.5 7.5V2.5H12.5L14.4083 4.40833ZM5.59167 15.5917L8.09167 13.0917L6.90833 11.9083L4.40833 14.4083L2.5 12.5V17.5H7.5L5.59167 15.5917Z" fill="black" />
  </Svg>
);

const { width, height } = Dimensions.get('window');

export default function FloatingPlayer() {
  const router = useRouter();
  const { isMinimized, setIsMinimized, trackData, isPlaying, sound, setIsPlaying } = usePlayerStore();
  const [expanded, setExpanded] = useState(false);

  const currentCard = CARDS.find(c => c.title === trackData?.title) || CARDS[1];
  const bgColor = currentCard.color;
  const imageSource = currentCard.image;

  // Position for the floating button
  const translateX = useSharedValue(width - 80);
  const translateY = useSharedValue(height - 150);
  const isDragging = useSharedValue(false);

  const pan = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onFinalize(() => {
      // Snap to edges
      if (translateX.value > width / 2) {
        translateX.value = withSpring(width - 80);
      } else {
        translateX.value = withSpring(20);
      }

      if (translateY.value < 50) translateY.value = withSpring(50);
      if (translateY.value > height - 100) translateY.value = withSpring(height - 100);

      isDragging.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: withSpring(isDragging.value ? 0.7 : 0.9),
      position: 'absolute',
      zIndex: 9999,
    };
  });

  const popupStyle = useAnimatedStyle(() => {
    const spaceBelow = height - (translateY.value + 56);
    const popupHeight = 80;
    const isSpaceBelow = spaceBelow > popupHeight + 20;

    const popupY = isSpaceBelow ? translateY.value + 64 : translateY.value - 84;

    return {
      position: 'absolute',
      left: 20,
      right: 20,
      top: withSpring(popupY),
      zIndex: 10000,
    };
  });

  const handlePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleExpand = () => {
    setIsMinimized(false);
    setExpanded(false);
    router.push('/player');
  };

  if (!isMinimized) return null;

  return (
    <>
      {/* The Draggable Button */}
      <GestureDetector gesture={pan}>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setExpanded(!expanded)}
            className="w-[56px] h-[56px] bg-white rounded-full items-center justify-center border border-gray-100"
          >
            <Ionicons name="musical-notes" size={24} color="black" style={{ marginLeft: -3 }} />
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>

      {/* The Pill Popup */}
      {expanded && (
        <Animated.View style={popupStyle}>
          <View className="bg-white rounded-[24px] flex-row items-center p-3 border border-gray-100">
            {/* Album Art */}
            <View
              className="w-[48px] h-[48px] rounded-[16px] mr-4 items-center justify-center overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              {trackData ? (
                <Image source={imageSource} style={{ width: 34, height: 34 }} resizeMode="contain" />
              ) : (
                <Ionicons name="musical-notes" size={24} color="white" />
              )}
            </View>

            {/* Info */}
            <View className="flex-1 mr-4">
              <Text className="font-jakarta-bold text-[16px] text-black" numberOfLines={1}>
                {trackData?.title || 'Motivasi'}
              </Text>
              <View className="flex-row items-center mt-1">
                {currentCard.category === 'rileks' && <IconRileks color="#808080" width={12} height={12} />}
                {currentCard.category === 'lelap' && <IconLelap color="#808080" width={12} height={12} />}
                {currentCard.category === 'alam' && <IconAlam color="#808080" width={12} height={12} />}
                {currentCard.category === 'fokus' && <IconFokus color="#808080" width={12} height={12} />}
                {!['rileks', 'lelap', 'alam', 'fokus'].includes(currentCard.category) && <MaterialCommunityIcons name="tree-outline" size={12} color="#808080" />}
                <Text className="font-jakarta-regular text-[12px] text-[#808080] ml-1 capitalize" numberOfLines={1}>
                  {currentCard.category}
                </Text>
              </View>
            </View>

            {/* Controls */}
            <TouchableOpacity onPress={handlePlayPause} className="p-2">
              <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleExpand} className="p-2 ml-2">
              <IconMaximize />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
}
