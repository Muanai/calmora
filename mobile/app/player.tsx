import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

import vinylImage from '../assets/meditation/vinyl.png';
import bgImage from '../assets/meditation/play-meditation-bg.png';

import { usePlayerStore } from '../stores/player-store';
import { audioAssets } from './meditation';

const { width } = Dimensions.get('window');

const IconMinimize = () => (
  <Svg width="24" height="24" viewBox="0 0 29 29" fill="none">
    <Path d="M5.69142 3.97546L3.97559 5.6913L7.60059 9.3163L4.8335 12.0834H12.0835V4.83338L9.31642 7.60046L5.69142 3.97546ZM19.6839 7.60046L16.9168 4.83338V12.0834H24.1668L21.3998 9.3163L25.0247 5.6913L23.3089 3.97546L19.6839 7.60046ZM24.1668 16.9167H16.9168V24.1667L19.6839 21.3996L23.3089 25.0246L25.0247 23.3088L21.3998 19.6838L24.1668 16.9167ZM7.60059 19.6838L3.97559 23.3088L5.69142 25.0246L9.31642 21.3996L12.0835 24.1667V16.9167H4.8335L7.60059 19.6838Z" fill="black"/>
  </Svg>
);

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const title = (params.title as string) || 'Motivasi';
  const soundId = (params.soundId as string) || 'motivasi';
  const audioSource = audioAssets[soundId];

  const { 
    sound, isPlaying, position, duration, isShuffle, repeatMode,
    setIsPlaying, setIsShuffle, setRepeatMode, loadAudio, setIsMinimized, unloadAudio
  } = usePlayerStore();

  const spinValue = useRef(new Animated.Value(0)).current;

  const isExiting = useRef(false);

  useEffect(() => {
    if (isExiting.current) return;
    
    if (!sound) {
      loadAudio(audioSource, {
        title: title as string,
        subtitle: 'Meditasi',
        uri: audioSource,
      });
    } else {
      setIsMinimized(false);
    }
  }, [sound]);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    let anim: Animated.CompositeAnimation;
    
    const startSpin = () => {
      spinValue.stopAnimation((currentVal) => {
        if (!isPlayingRef.current) return;
        anim = Animated.timing(spinValue, {
          toValue: currentVal + 1,
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: true,
        });
        anim.start(({ finished }) => {
          if (finished && isPlayingRef.current) {
            startSpin();
          }
        });
      });
    };

    if (isPlaying) {
      startSpin();
    } else {
      spinValue.stopAnimation();
    }
    
    return () => {
      spinValue.stopAnimation();
    };
  }, [isPlaying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
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
  
  const handleNext = async () => {
    if (!sound) return;
    await sound.setPositionAsync(duration);
  };
  
  const handlePrev = async () => {
    if (!sound) return;
    await sound.setPositionAsync(0);
  };

  const formatTime = (millis: number) => {
    const mins = Math.floor(millis / 60000);
    const secs = Math.floor((millis % 60000) / 1000);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const progressPercent = Math.min((position / duration) * 100, 100);

  return (
    <View className="flex-1">
      <Image 
        source={bgImage} 
        style={StyleSheet.absoluteFill} 
        className="w-full h-full"
        resizeMode="cover"
      />

      {/* Header */}
      <View 
        className="px-6 flex-row items-center justify-between z-10" 
        style={{ paddingTop: insets.top + 50 }}
      >
        <TouchableOpacity 
          onPress={async () => {
            isExiting.current = true;
            await unloadAudio();
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)');
            }
          }} 
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text className="font-jakarta-bold text-[24px] text-black">
          {title}
        </Text>
        
        <TouchableOpacity 
          className="p-2 -mr-2"
          onPress={() => {
            setIsMinimized(true);
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)');
            }
          }}
        >
          <IconMinimize />
        </TouchableOpacity>
      </View>

      {/* Center Animation Area */}
      <View className="flex-1 items-center justify-center">
        <Animated.View style={{ transform: [{ rotate: spin }], width: '100%', height: '100%', maxWidth: 360, maxHeight: 360 }}>
          <Image 
            source={vinylImage} 
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Bottom Section */}
      <View className="px-6 pb-12 w-full">
        {/* Slider */}
        <View className="flex-row items-center justify-between mb-8">
          <Text className="font-jakarta-regular text-[12px] text-black">{formatTime(position)}</Text>
          <View className="flex-1 mx-4 h-[4px] bg-[#806DE3]/30 rounded-sm relative">
            <View 
              className="absolute left-0 top-0 bottom-0 bg-[#806DE3] rounded-sm" 
              style={{ width: `${progressPercent}%` }}
            />
            <View 
              className="absolute top-1/2 -mt-[8px] -ml-[8px] w-[16px] h-[16px] bg-white rounded-full shadow-sm"
              style={{ left: `${progressPercent}%` }}
            />
          </View>
          <Text className="font-jakarta-regular text-[12px] text-black">{formatTime(duration)}</Text>
        </View>

        {/* Playback Controls */}
        <View className="flex-row items-center justify-between px-2 mb-12">
          <TouchableOpacity 
            className={`w-[40px] h-[40px] ${isShuffle ? 'bg-[#806DE3]' : 'bg-white/50'} rounded-full items-center justify-center`}
            onPress={() => setIsShuffle(!isShuffle)}
          >
            <Ionicons name="shuffle" size={20} color={isShuffle ? "white" : "black"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-[50px] h-[50px] bg-white rounded-full items-center justify-center"
            onPress={handlePrev}
          >
            <Ionicons name="play-skip-back" size={24} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-[70px] h-[70px] bg-white rounded-full items-center justify-center shadow-sm"
            onPress={handlePlayPause}
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-[50px] h-[50px] bg-white rounded-full items-center justify-center"
            onPress={handleNext}
          >
            <Ionicons name="play-skip-forward" size={24} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`w-[40px] h-[40px] ${repeatMode > 0 ? 'bg-[#806DE3]' : 'bg-white/50'} rounded-full items-center justify-center relative`}
            onPress={() => setRepeatMode((repeatMode + 1) % 3)}
          >
            <Ionicons name="repeat" size={20} color={repeatMode > 0 ? "white" : "black"} />
            {repeatMode === 2 && (
              <View className="absolute top-1 right-1 bg-white rounded-full w-3 h-3 items-center justify-center">
                <Text className="text-[8px] font-bold text-[#806DE3]">1</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          activeOpacity={0.9}
          className="w-full bg-[#806DE3] h-[56px] rounded-[16px] flex-row items-center justify-center"
        >
          <Text className="font-jakarta-semibold text-[16px] text-white tracking-wide mr-2">
            Eksplorasi Fitur Lainnya
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
